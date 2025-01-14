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
        const naverLogin = new window.naver.LoginWithNaverId({
            clientId: "YOUR_NAVER_CLIENT_ID", // 네이버에서 발급받은 클라이언트 아이디
            callbackUrl: "YOUR_REDIRECT_URL", // 리디렉션 URL (백엔드에서 받은 콜백 URL)
            isPopup: false, // 팝업 방식 여부
            loginButton: {
                color: "green", // 버튼 색상
                type: 3, // 버튼 형태 (기본, 텍스트 버튼 등)
                height: 44, // 버튼 높이
            },
        });

        naverLogin.init(); // 네이버 로그인 객체 초기화

        // 로그인 성공 여부를 확인하는 함수
        if (naverLogin.isLogin) {
            setIsLoggedIn(true);
            setUser(naverLogin.getProfile()); // 사용자 정보 가져오기
        }

    }, []);

    


    return (
        <div>
            {!isLoggedIn ? (
                    <div id="naverIdLogin" onClick={handleNaverLogin}></div>
            ) : (
                <div>
                    <p>{user?.name}님, 환영합니다!</p>
                </div>
            )}
        </div>
    );
};

export default NaverLogin;
