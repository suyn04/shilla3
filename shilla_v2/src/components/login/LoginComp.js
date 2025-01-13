import React, {useState, useEffect}  from "react";
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../scss/common.scss'
import '../../scss/login.scss'
import NaverLogin from "./NaverLogin";

const bkURL = process.env.REACT_APP_BACK_URL;

const LoginComp = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null) // 로그인된 사용자 정보 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false) // 로그인 상태

    //로그인 세션 확인
    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('id');
        if (loggedInUser) {
            setIsLoggedIn(true)//로그인 상태 업데이트
            setUser({
                id: sessionStorage.getItem('id'),
                name: sessionStorage.getItem('name'),
                grade: sessionStorage.getItem('grade')
            });
        }
    }, []);


    function loginGo() {
        const frmData = new FormData(document.loginFrm)//아래 폼태그 name값 가져옴
        const data = Object.fromEntries(frmData)

        console.log('loginGo() 진입');
        console.log(data);

        axios.post(`${bkURL}/login`, data)
            .then(res => {
                console.log('서버 응답:', res.data);
                if (res.data) {
                    const mem = res.data;

                    console.log('회원 등급:', mem.grade); 

                    // 등급이 4 또는 5인 경우 처리
                    if (mem.grade == 4) {
                        alert('이용불가회원입니다. 현재 이용이 불가능합니다. \n자세한 내용을 알고 싶으시면 \n대표전화 02-2233-3131 으로 문의 주세요.');
                        navigate('/');
                        return; 
                    }

                    if (mem.grade == 5) {
                        alert('이미 탈퇴한 회원입니다. 현재 이용이 불가능합니다. \n자세한 내용을 알고 싶으시면 \n대표전화 02-2233-3131 으로 문의 주세요.');
                        navigate('/');
                        return; 
                    }

                    // 세션정보 저장
                    sessionStorage.setItem("id", mem.member_id);
                    sessionStorage.setItem("name", mem.name);
                    sessionStorage.setItem("grade", mem.grade);

                    alert(`${mem.name}님, 로그인 성공`);
                    setUser({
                        id: mem.member_id,
                        name: mem.name,
                        grade: mem.grade,
                    });
                    setIsLoggedIn(true);
                    navigate("/");

                } else {
                    alert("로그인 실패");
                }

            }).catch(err => {
                console.error('서버에러 발생 : ', err);
                alert('로그인 중 오류가 발생했습니다.');
            });
    }

    // 키보드에서 엔터가 눌렸을 때 로그인 함수 호출
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            loginGo();
        }
    }


    return (
        <>
            {/* <!-- 로그인 --> */}
            <div className="form-wrap">
                <div className="center">
                    <form id="shilla-login" method="post" name="loginFrm">
                        <div className="login-wrap" id="login-wrap">
                            <h2>로 그 인</h2>
                            <div className="hello">서울 신라호텔에 오신 것을 환영합니다.</div>
                            <div className="part-id">
                                <label htmlFor="id">아이디 </label>
                                <input type="text" id="id" autoComplete="on" name="id" onKeyDown={handleKeyDown} />
                            </div>
                            <div className="part-pw">
                                <label htmlFor="pw">비밀번호 </label>
                                <input type="password" id="pw" maxLength="16" name="pw" onKeyDown={handleKeyDown} />
                            </div>
                            <div className="part-error">
                                <p id="error-message" className="error-message">아이디와 비밀번호를 확인해 주세요.</p>
                                <p id="error-message2" className="error-message">패스워드는 영문, 숫자, 특수문자를 포함하여 12~16자여야 합니다.</p>
                                <p id="error-message3" className="error-message">아이디는 영문자와 숫자만(6글자 이상) 사용 가능합니다.</p>
                            </div>
                            <button type="button" className="btn-login" onClick={loginGo}>로그인</button>

                            <div className="link-wrap">
                                <Link to="/join">회원가입</Link>
                                <Link to="/findid">ID/PW찾기</Link>
                            </div>

                        </div>
                    </form>
                    <NaverLogin/>
                </div>
            </div>
        </>
    );
};

export default LoginComp;
