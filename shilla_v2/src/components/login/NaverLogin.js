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

        axios.get(`${bkURL}/naverLogin/check`)
            .then(res => {
                console.log('서버 응답:', res.data.loggedIn);
                if (res.data.loggedIn) {
                    const mem = res.data.loggedIn;
    
                    console.log('회원 :', mem); 
    
                    // 등급이 4 또는 5인 경우 처리
                    // if (mem.grade == 4) {
                    //     alert('이용불가회원입니다. 현재 이용이 불가능합니다. \n자세한 내용을 알고 싶으시면 \n대표전화 02-2233-3131 으로 문의 주세요.');
                    //     navigate('/');
                    //     return; 
                    // }
    
                    // if (mem.grade == 5) {
                    //     alert('이미 탈퇴한 회원입니다. 현재 이용이 불가능합니다. \n자세한 내용을 알고 싶으시면 \n대표전화 02-2233-3131 으로 문의 주세요.');
                    //     navigate('/');
                    //     return; 
                    // }
    
                    // 세션정보 저장
                    sessionStorage.setItem("id", mem.member_id);
                    sessionStorage.setItem("name", mem.name);
                    sessionStorage.setItem("grade", mem.grade);
    
                    // alert(`${mem.name}님, 로그인 성공`);
                    setUser({
                        id: mem.member_id,
                        name: mem.name,
                        grade: mem.grade,
                    });
                    setIsLoggedIn(true);
                    // navigate("/");
    
                } else {
                    alert("로그인 실패");
                }
    
            }).catch(err => {
                console.error('서버에러 발생 : ', err);
                alert('로그인 중 오류가 발생했습니다.');
            });
            console.log(isLoggedIn)
    };


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
