const express = require("express");
const router = express.Router();
const conn = require("../db");
const axios = require('axios');
const session = require("express-session");
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
        // return res.redirect(naverLoginUrl);//네이버 로그인 페이지로 이동
        // res.end("<a href='"+ naverLoginUrl + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
        
        
    });

    router.get("/callback", async (req, res) => {
        const { code, state } = req.query;
        console.log(req.query, code, state, req.session.state)
        if(state != req.session.state){
            //보안 강화를 위함
            return res.status(400).send('state 값 일치하지 않음')
        }
        // 액세스 토큰 요청
        // const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
        naverLoginUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=`
                        + CLIENT_ID+`&client_secret=`+CLIENT_SECRET+`&redirect_uri=`+REDIRECT_URI+`&code=`+code+`&state=`+state;
        
        const response = await fetch(naverLoginUrl,{
            headers: {
                'X-Naver-Client-Id':CLIENT_ID, 
                'X-Naver-Client-Secret': CLIENT_SECRET
            }
            
        })
        const tokenRequest = await response.json();
        // return res.send(tokenRequest);

        if ("access_token" in tokenRequest) {
            const { access_token } = tokenRequest;
            const apiUrl = "https://openapi.naver.com/v1/nid/me";
        
            const data = await fetch(apiUrl, {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            });
        
            const userData = await data.json();
        
            //사용자 정보 콘솔로 받아오기 -> DB에 저장하기 
            console.log("userData:", userData);
          }
        
          return res.send("DB에 저장하고 랜드페이지로 redirect ");
        });
    /*
        //네이버 예제 코드인데 request 모듈사용에서 에러 발생
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