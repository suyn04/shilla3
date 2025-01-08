import React, {useState, useEffect}  from "react";
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../scss/common.scss'
import '../../scss/login.scss'

const bkURL = process.env.REACT_APP_BACK_URL;

const LoginComp = () => {

    const navigate = useNavigate()


    function loginGo() {
        const frmData = new FormData(document.loginFrm); // 아래 폼태그 name 값 가져옴
        const data = Object.fromEntries(frmData);

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
                    navigate("/");

                } else {
                    alert("로그인 실패");
                }

            }).catch(err => {
                console.log('서버에러 발생 : ', err);
            });
    }

    // 키보드에서 엔터가 눌렸을 때 로그인 함수 호출
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
        loginGo();
        }
    }

    // const { naver } = window;
    // const [user, setUser] = useState(null);//사용자 정보 가져오기
    // const [showExternalLogin, setShowExternalLogin] = useState(true)

    // // 예시: React 컴포넌트에서 환경 변수 사용
    // let clientId = process.env.REACT_APP_CLIENT_ID;
    // let clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    // let redirectURI = process.env.REACT_APP_REDIRECT_URI;

    // const naverLogin = new naver.LoginWithNaverId({
    //     clientId: process.env.REACT_APP_CLIENT_ID,
    //     clientSecret : process.env.REACT_APP_CLIENT_SECRET,
    //     callbackUrl: process.env.REACT_APP_REDIRECT_URI,
    //     isPopup: true,
    //     loginButton: {
    //       color: "green",
    //       type: 3,// 타입종류 :1,2,3
    //       height: 50,
    //     },
    //   });
    // useEffect(() => {
    //     naverLogin.init();//최초 1번 초기화시킴킴
    //     // console.log("네이버 초기화");
    //     getUser();//사용자 정보 가져옴 
    // }, []);

    // const getUser = async () => {
    //     await naverLogin.getLoginStatus((status) => {
    //         console.log(`로그인?: ${status}`);
    //         if (status) {
    //             setUser({ ...naverLogin.user });//로그인 정보 가져오기
    //             window.opener.location.href="http://localhost:3000/callback";//메인으로 이동 
    //             window.close();//팝업은 닫기 
    //         }
    //     });
    // };
    // console.log(naverLogin)

    const naverIdLogin = () =>{
        window.location.href = `${bkURL}/naverLogin`
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

                            {/* <p id="naverIdLogin">네이버로그인</p> */}
                            <p onClick={naverIdLogin}>네이버로그인</p>
                            <p>구글로그인</p>
                            <p>페이스북로그인</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginComp;
