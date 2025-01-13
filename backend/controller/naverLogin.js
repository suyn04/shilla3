const express = require("express");
const router = express.Router();
const conn = require("../db");
const axios = require('axios');
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, STATE} = require('./naverLoginInfo');
let naverLoginUrl = ``



// 인덱스에서 넘기는 자료를 받아서 처리
module.exports = () => {//이미 로그인 돼있다면 이 화면은 생략되고 callback으로 이동
    
    router.get("/", async (req, res) => {//네이버 로그인/bk/naverLogin
        req.session.state = STATE; // 세션에 state 저장
        // console.log("login 목록 접근", req.session);
        // console.log(req.session.state)
        naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
        res.redirect(naverLoginUrl);//네이버 로그인 페이지로 이동
        
    });

    router.get("/callback", async (req, res) => {//네이버 애플리케이션에 설정한 콜백url 
          const { code, state } = req.query;

          if(state != req.session.state){
              //보안 강화를 위함
              return res.status(400).send('state 값 일치하지 않음')
          }

          try {
            const tokenRequest = await axios.post(
                `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}&state=${state}`
            );
    
            if ("access_token" in tokenRequest.data) {
                const { access_token } = tokenRequest.data;
    
                const userResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
    
                const userData = userResponse.data.response;
    
                const [existingUser] = await conn.execute(
                    `SELECT * FROM member WHERE member_id = ?`, [userData.id]
                );
    
                if (existingUser && existingUser.length > 0) {
                    req.session.user = existingUser[0];
                    console.log("세션에 저장된 사용자 정보01:", req.session.user)
                    return res.redirect(`http://localhost:5002/bk/naverLogin/check`);
                } else {
                    await conn.execute(
                        'INSERT INTO member (member_id, pw, name, email, grade) VALUES (?, ?, ?, ?, 3)', [
                            userData.id,
                            generateRandomString(12),
                            userData.name,
                            userData.email,
                        ]
                    );
    
                    req.session.user = {
                        member_id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        grade: 3,
                    };
                    console.log("세션에 저장된 사용자 정보02:", req.session.user);
                    return res.redirect(`http://localhost:5002/bk/naverLogin/check`);
                    // return res.json({ loggedIn: true, user: req.session.user });
                }
            } else {
                return res.status(400).send('access_token 접근 실패');
            }
        } catch (err) {
            console.error("네이버 로그인 처리 오류 발생:", err);
            return res.status(500).send('네이버 로그인 처리 서버 오류');
        }
      });

      router.get('/check', (req, res)=>{//로그인 상태 확인 라우터
        if(req.session.user){
            console.log("세션에 저장된 사용자 정보03:", req.session.user);
            // return res.redirect(`http://localhost:3000`);
           res.json({loggedIn: true, user : req.session.user})
        }else{
          res.json({ loggedIn : false })
        }
      })
      
    //비번 랜덤 생성
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    return router;
}