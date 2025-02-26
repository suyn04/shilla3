import axios from 'axios'; // axios 불러오기
import { useEffect, useState } from 'react'; // useState, useEffect 불러오기
import { Link, useNavigate, useParams } from 'react-router-dom'; // useParams, useNavigate, Link 불러오기

import '../../../scss/admin.scss'; // admin scss 불러오기
import Footer from '../../common/Footer'; // Footer UI 불러오기
import Header from '../../common/Header'; // Header UI 불러오기
import AdminTabMenu from '../AdminTabMenu'; // 좌측 탭메뉴 불러오기

const AdminCont3Detail = () => {
    const bkURL = process.env.REACT_APP_BACK_URL;
    const navigate = useNavigate(); // 페이지 이동하는 navigate 변수
    const [ member, memberSet ] = useState(null); // 회원 정보 상태 (초기값 null)
    const [ reservation, reservationSet ] = useState([]); // 예약 정보 상태 (초기값 빈 배열)
    const { id } = useParams(); // URL에 전달된 파라미터 id 추출

    useEffect(() => { // useEffect 렌더링, API 호출하여 데이터 가져오도록 설정
        document.title = "신라호텔:관리자"
        
        const fetchReservations = async () => { // 동시 처리를 위해 비동기 함수 선언 (Promise로 객체 반환)
            try {
                const response = await axios.get(`${bkURL}/admin/member/detail/${id}`) // 응답 데이터 response에 담기
                // await 비동기 작업 완료될 때 까지 대기(axios.get)으로 보내는 http 요청이 완료될 때 까지 대기 후 response에 할당
                // GET 요청을 보내서 특정 회원의 정보를 가져오는 작업을 수행, 요청 대기 후 response 할당
                reservationSet(response.data.reserve) // reservation의 상태 업데이트 함수, reservationSet의 응답 데이터인 reserve(예약정보 데이터)를 실행
                memberSet(response.data.mem) // member의 상태 업데이트 함수, 회원 정보를 담음, memberSet 함수에 전달해 member 상태를 업데이트
            } catch (err) {
                console.error("예약 정보 가져오는 중 오류 발생:", err) // 오류 발생
            }
        }
        fetchReservations() // 예약을 담은 변수 실행
    }, [id]) // useParam 전달된 파라미터로 id를 한번만 실행

    if (!member) { // member가 아닌 경우
        return <>
            <Header/> 
            <div className="admin-wrap">
                <div className="center">
                    <AdminTabMenu/>
                    <div className="tab-contents">
                        <h2>{`${name}(${id})님의 회원 정보`}</h2> 
                        <Link to="/admin/member">목록으로</Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    }

    const getReservation = (item) => {
        const today = new Date();
        const formattedToday = today.setHours(0, 0, 0, 0); // 오늘 날짜 자정 기준으로 설정
    
        // start_date와 join_date를 Date 객체로 변환
        const startDate = new Date(item.start_date).setHours(0, 0, 0, 0); // 예약 시작일 자정으로 설정
        const joinDate = new Date(item.join_date).setHours(0, 0, 0, 0); // 가입일 자정으로 설정
    
        if (item.Cancel === "1") {
            return "예약 취소"; // 예약 취소
        } else if (startDate < formattedToday) {
            return "이용 완료"; // 오늘 날짜 이전에 예약 시작
        } else if (startDate >= formattedToday && joinDate <= formattedToday) {
            return "예약 완료"; // 오늘 날짜 이후에 시작하지만 이미 예약 완료된 경우
        } else if (joinDate > formattedToday) {
            return "예약 확정"; // 오늘 날짜 이후에 이용할 예약
        } else {
            return "예약 상태 불명"; // 조건에 맞지 않으면 예비 상태
        }
    };


    return (
        <>
            <div className="cont cont3">
                <Header/>
                <div className="admin-wrap">
                    <div className="center">
                        <AdminTabMenu/>
                        <div className="tab-contents">
                            <h2>{`${member.name}(${id})님의 회원 정보`}</h2>
                            <div className="board-memberInfo-table">
                                <ul className="table-title">
                                    <li>예약번호</li>
                                    <li>체크인</li>
                                    <li>체크아웃</li>
                                    <li>총금액</li>
                                    <li>성인</li>
                                    <li>어린이</li>
                                    <li>이용 현황</li>
                                </ul>
                                {reservation.length > 0 ? (
                                    reservation.map((item, idx) => (
                                        <ul className="table-contents" key={idx}>
                                            <li>{item.reservation_id} </li>
                                            <li>{`${new Date(item.start_date).getFullYear().toString().slice(2)}-
                                            ${(new Date(item.start_date).getMonth() + 1).toString().padStart(2, '0')}-
                                            ${new Date(item.start_date).getDate().toString().padStart(2, '0')}`} </li>
                                            <li>{`${new Date(item.end_date).getFullYear().toString().slice(2)}-
                                            ${(new Date(item.end_date).getMonth() + 1).toString().padStart(2, '0')}-
                                            ${new Date(item.end_date).getDate().toString().padStart(2, '0')}`} </li>
                                            <li>{item.tot_price.toLocaleString()}원 </li>
                                            <li>{item.adult_cnt} 명 </li>
                                            <li>{item.child_cnt} 명 </li>
                                            <li>{getReservation(item)}</li>
                                        </ul>
                                    ))
                                ) : (
                                    <ul className="table-reserve-none">
                                        <li>예약 정보가 없습니다.</li>
                                    </ul>
                                )}
                            </div>
                            <Link to="/admin/member" className="toList">목록으로</Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
};

export default AdminCont3Detail;