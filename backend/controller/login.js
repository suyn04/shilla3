const express = require("express");
const router = express.Router();
const conn = require("../db");


// 인덱스에서 넘기는 자료를 받아서 처리
module.exports = () => {


    // 로그인 정보 받아오기
    router.post("/", async (req, res) => {
        console.log("login 목록 접근");

        try {
            const {id, pw} = req.body
            const sql = "select member_id, name, grade from member where member_id = ? and pw =?"
            const param = [id,pw]
            const [rows] = await conn.execute(sql,param);
            console.log(rows);
            res.json(rows[0]);
            
        } catch (err) {
            res.status(500).send('로그인 서버 오류');
        }
        
    });


    router.get("/", async (req, res) => {
        console.log("login 목록 접근", req.session);

        if(req.session.user){ // user라는 세션이 있으면 loginComplete.html 페이지가 뜨고 user 이름도 넣어준다.
            
            res.json(req.session.user);
        }
        else{ //user라는 세션이 없다면 로그인 페이지가 뜬다.
            res.send(`로그인 정보 없음`);
        }
        
    });

    return router;
};

/*
같은 port 사용시에는  session 같이 사용 OK
port 가 달라서 세션을 잃어버림

*/
