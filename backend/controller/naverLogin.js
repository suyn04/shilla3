const express = require("express");
const router = express.Router();
const conn = require("../db");
const naverLogin = require("./naverLoginInfo");
const dotenv = require('dotenv');
dotenv.config();


// 인덱스에서 넘기는 자료를 받아서 처리
module.exports = () => {

    router.get("/", async (req, res) => {//네이버 로그인/bk/login/naver
        const state = Math.random().toString(36).substring(7);
        req.session.state = state; // 세션에 state 저장
        console.log("login 목록 접근", req.session);

        const client_id = naverLogin.clientId;
        const redirectURI = encodeURIComponent(naverLogin.redirectURI);
        const naverLoginUrl 
        = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&state=${state}&redirect_uri=${redirectURI}`;
        res.redirect(naverLoginUrl);//네이버 로그인 페이지로 이동
        // console.log(naverLoginUrl);
        
    });

    router.get("/callback", async (req, res) => {
        const { code, state } = req.query;
        if(state !== req.session.state){
            return res.status(400).send('status mismatch')
        }
        try{
            const client_id = naverLogin.clientId;
            const client_secret = naverLogin.clientSecret;
            const redirectURI = encodeURIComponent(naverLogin.redirectURI);

            //API로 토큰 요청 방식 
            const response = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
                params: {
                  grant_type: 'authorization_code',
                  client_id: client_id,
                  client_secret: client_secret,
                  code: code,
                  state: state,
                  redirect_uri: redirectURI,
                }
            });
            const accessToken = response.data.access_token;//액세스 토큰

            // 사용자 정보 요청
            const userInfo = await axios.get('https://openapi.naver.com/v1/nid/me', {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                }
            });
            res.json(userInfo.data);//사용자 정보 반환

        }
        catch(err){
            console.error(err)
            res.status(500).send('네이버 로그인 사용자 정보 받아오기 오류')
        }
    })
    return router;
}