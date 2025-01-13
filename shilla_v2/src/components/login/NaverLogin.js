import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const bkURL = process.env.REACT_APP_BACK_URL;

const NaverLogin = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleNaverLogin = (e) => {
        e.preventDefault();
        window.location.href = `${bkURL}/naverLogin`// 네이버 로그인 백엔드 URL로 리디렉션
    };

    useEffect(() => {
        axios.get(`${bkURL}/naverLogin/check`)
            .then((response) => {
                if (response.data.loggedIn) {
                    console.log(response.data)
                    setIsLoggedIn(true)
                    setUser(response.data.user)

                    //세션에 키값 저장
                    sessionStorage.setItem('id', response.data.user.member_id)
                    sessionStorage.setItem('name', response.data.user.name)
                    sessionStorage.setItem('grade', response.data.user.grade)

                    // navigate('/')// 메인 페이지로 이동
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch((error) => {
                console.error('로그인 상태 확인 오류:', error);
            });
    }, []);

    return (
        <div>
            {!isLoggedIn ? (
                <div>
                    <button onClick={handleNaverLogin}>네이버 로그인</button>
                </div>
            ) : (
                <div>
                    <p>{user?.name}님, 환영합니다!</p>
                    <button onClick={() => navigate('/')}>메인 페이지로</button>
                </div>
            )}
        </div>
    );
};

export default NaverLogin;
