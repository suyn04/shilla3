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
        naverLoginUrl 
        = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
        res.redirect(naverLoginUrl);//네이버 로그인 페이지로 이동
        
    });

    router.get("/callback", async (req, res) => {
        const { code, state } = req.query;

        if(state != req.session.state){
            //보안 강화를 위함
            return res.status(400).send('state 값 일치하지 않음')
        }

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
        
        // 12자리 랜덤 문자열 생성
        const randomPw = generateRandomString(12);//비번번
        // console.log(randomPw);

        // 액세스 토큰 요청
        const tokenRequest = await axios.post(
            `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}&state=${state}`
        );

        if ("access_token" in tokenRequest.data) {
            const { access_token } = tokenRequest.data;
            
            //네이버 사용자 정보 가져오기
            const userResponse = await axios.get("https://openapi.naver.com/v1/nid/me",{
              headers: {
                Authorization: `Bearer ${access_token}`,
              }
            });
        
            const userData = userResponse.data.response;
            //사용자 정보 : userData 콘솔로 받아오기 -> DB에 저장하기 

            const [existingUser] = await conn.execute(
              `select * from member where member_id = ?`, [userData.id]
            )//기존 멤버id에서 userData.id랑 같은값 찾기

            if(existingUser && existingUser.length > 0){
              req.session.user = existingUser[0];//req.session.user에 사용자 정보 저장
              return res.json({message : '로그인 성공', user : existingUser[0]})
            }else{
              await conn.execute(
                  'INSERT INTO member (member_id, pw, name, email, grade) VALUES (?, ?, ?, ?, 3)', [
                    userData.id,
                    randomPw,
                    userData.name,
                    userData.email,
                ]
              );
              const createdUser = {
                member_id : userData.id,
                randomPw,
                name :userData.name,
                email :userData.email
              }
              req.session.user = createdUser;
              return res.redirect("http://localhost:3000")//로그인 후 메인 가기 
            }
            // console.log("userData:", userData);
            // return res.redirect("http://localhost:3000");
          }else{
            return res.status(400).send('access_token 접근 실패')
          }
          
        });

        router.get('/check', (req, res)=>{//로그인 상태 확인 라우터
          if(req.session.user){
            res.json({loggedIn: true, user : req.session.user})
          }else{
            res.json({ loggedIn : false })
          }
        })
    /*
        //네이버 예제 적용한 코드 부분인데 request 모듈사용에서 에러 발생
        //npm install node-fetch@2 로 fetch2 설치해서 진행

        var options = {
            url : naverLoginUrl,
            headers: {
                'X-Naver-Client-Id':CLIENT_ID, 
                'X-Naver-Client-Secret': CLIENT_SECRET
            }
        }

        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              res.writeHead(
                200, {
                    'Content-Type': 'text/json;charset=utf-8'
                });
              res.end(body);
            } else {
              res.status(response.statusCode).end();
              console.log('error = ' + response.statusCode);
            }
        });*/
      
    return router;
}