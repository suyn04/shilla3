import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const bkURL = process.env.REACT_APP_BACK_URL;


function LoginCallback(props) {
        // window.location.href = `${bkURL}/naverLogin`// 네이버 로그인 백엔드 URL로 리디렉션
        const [userData, setUserData] = useState(null);
        const [accessToken, setAccessToken] = useState(null);
        const [grade, setGrade] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const state = params.get('state');
            const access_token = params.get('access_token');
            const userDataParam = params.get('userData');
            const gradeParam = params.get('grade');

            const parsedUserData = userDataParam ? JSON.parse(userDataParam) : null;

            setAccessToken(access_token);
            setGrade(gradeParam);
            setUserData(parsedUserData);

            // console.log('Code:', code);
            // console.log('State:', state);
            // console.log('Access Token:', access_token);
            // console.log('User Data:', parsedUserData);
            // console.log('Grade:', gradeParam);

            // console.log('Backend URL:', bkURL);
            axios.get(`${bkURL}/naverLogin/getUserInfo`,{withCredentials: true})
            .then(res => {
                if (res.data.loggedIn) {
                    setUserData(res.data.user);//세션에서 가져온 정보
                    setGrade(res.data.user.grade);//등급

                    //로그인 성공 시 세션에 데이터 저장
                    sessionStorage.setItem('id', res.data.user.member_id);
                    sessionStorage.setItem('name', res.data.user.name);
                    sessionStorage.setItem('grade', res.data.user.grade);

                    alert(`${res.data.user.name}님, 로그인 성공`);
                    navigate("/")
                } else {
                    console.log("로그인되지 않음");
                }
            })
            .catch(error => {
                console.error("사용자 정보 가져오기 실패:", error);
            });

        },[navigate])

        
        return (
            <>
                {userData ? (
                <div>
                    {/* <h2>{userData.name}</h2>
                    <p>이메일: {userData.email}</p>
                    <p>아이디: {userData.member_id}</p>
                    <p>등급: {grade}</p> */}
                </div>
            ) : (
                <div></div>
                // <p>로그인 처리 중...</p>
            )}
            </>
        );
}

export default LoginCallback;