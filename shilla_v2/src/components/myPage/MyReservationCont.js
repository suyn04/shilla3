import React, { useEffect, useState } from "react";
import axios from "axios";

const MyReservationCont = () => {
  const [reservations, setReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [error, setError] = useState(null);
  const memberId = sessionStorage.getItem("id"); // 세션에서 member_id 가져오기

  const roomImages = {
    "스탠다드 디럭스": "../../img/sub/roomStandardBusiness01.jpg",
    "비지니스 디럭스": "../../img/sub/roomStandardDelux01.jpg",
    "베리어프리 비지니스 디럭스": "../../img/sub/roomStandardGrand01.jpg",
    "그랜드코너 디럭스": "../../img/sub/roomStandardGrand02.jpg",
    "이그제큐티브 비지니스 디럭스": "../../img/sub/roomExecutiveBusiness02.jpg",
    "이그제큐티브 그랜드 디럭스": "../../img/sub/roomExecutiveGrand02.jpg",
    "수페리어 스위트": "../../img/sub/roomSuiteSuperior01.jpg",
    "코리안 스위트": "../../img/sub/roomSuiteKorean02.jpg",
    "코너 스위트": "../../img/sub/roomExecutiveGrand02.jpg",
    "프리미어 스위트": "../../img/sub/roomSuitePremier01.jpg",
    "로열 스위트": "../../img/sub/roomSuiteRoyal01.jpg",
    "신라 스위트": "../../img/sub/roomSuiteShilla01.jpg",
    "프레지덴셜 스위트": "../../img/sub/roomSuitePresidential08.jpg",
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (memberId) {
      const fetchReservations = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5002/bk/myPage/myReservation",
            { params: { member_id: memberId } }
          );

          console.log("API 응답 데이터: ", response.data);
          console.log("예약 데이터 가져오기 :", response.data);

          const today = new Date();
          console.log("today :", today);
          const formattedDate = formatDate(today) 
          console.log("formattedDate: ", formattedDate);

          const currentReservations = response.data.filter((res) => {
            const endDate = formatDate(new Date(res.end_date));
            console.log(
              "종료 날짜: ",
              endDate,
              "현재 날짜와 비교: ",
              endDate >= formattedDate
            );
            return endDate >= formattedDate; // 종료 날짜가 오늘 이후인 경우
          });

          const previousReservations = response.data.filter((res) => {
            const endDate = formatDate(new Date(res.end_date));
            console.log(
              "종료 날짜: ",
              endDate,
              "현재 날짜와 비교: ",
              endDate < formattedDate
            );
            return endDate < formattedDate; // 종료 날짜가 오늘 이전인 경우
          });

          setReservations(currentReservations);
          setPastReservations(previousReservations);
        } catch (error) {
          console.error("예약 데이터 가져오기 에러 :", error); // 에러 로그
          setError("예약 데이터를 가져오지 못함");
        }
      };

      fetchReservations();
    }
  }, [memberId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!reservations.length) {
    return <div>예약 내역이 없습니다</div>;
  }

  const handleCancel = async (reservationId, totPrice, paymentKey) => {
    console.log(
      "reservationId: ",
      reservationId,
      "totPrice: ",
      totPrice,
      "paymentKey: ",
      paymentKey
    );

    // if (!paymentKey) {
    //   alert("결제 키가 존재하지 않아서 취소 불가능");
    //   return;
    // }

    const confirmCancel = window.confirm(
      "해당 객실상품을 예약 취소하겠습니까?"
    );
    if (confirmCancel) {
      try {
        const response = await axios.post(
          "http://localhost:5002/bk/myPage/myReservation/cancel",
          {
            reservationId,
            totPrice,
            paymentKey,
          }
        );

        alert("예약이 취소되었습니다");
        setReservations((prev) =>
          prev.filter(
            (reservation) => reservation.reservation_id !== reservationId
          )
        );
      } catch (error) {
        console.error("예약 취소 오류:", error);
        alert("예약 취소 중 오류가 발생");
      }
    }
  };

  const renderReservation = (res) => {
    const totalPrice = typeof res.tot_price === "number" ? res.tot_price : 0;
    return ( 
      <div className="reser-room" key={res.reservation_id}>
        <div className="contents-wrap">
          <div className="room">
            <img
              src={
                roomImages[res.room_type] ||
                "/img/sub/roomStandardBusiness01.jpg"
              }
              alt={res.room_type || "Room Image"}
            />
          </div>
          <div className="reservation-info">
            <div className="info-item">
              패키지명 : {res.offer_name || "N/A"}
            </div>
            <div className="info-item">
              객실 타입 : {res.room_type || "N/A"} [{res.room_id}호]
            </div>
            <div className="info-item">
              예약일자 : {formatDate(res.start_date)} ~ {formatDate(res.end_date)}
            </div>
            <div className="info-item">체크인 시간 : 15:00</div>
            <div className="info-item">체크아웃 시간 : 11:00</div>
            <div className="info-item">
              이용 인원 : {res.adult_cnt}명(성인), {res.child_cnt}명(아동)
            </div>
            <div className="info-item">
              결제 금액 : {totalPrice.toLocaleString()}원
            </div>
          </div>
        </div>
        {new Date(res.end_date) > new Date() && (
          <button
            className="cancle-btn"
            onClick={() =>
              handleCancel(res.reservation_id, res.tot_price, res.payment_key)
            }
          >
            예약취소
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="reservate-info" id="reservate-info">
      <div className="reservation">
        <div className="info-title">현재 예약된 내역</div>
        {reservations.length > 0 ? (
          reservations.map((res) => renderReservation(res))
        ) : (
          <div>예약 내역이 없습니다</div>
        )}
      </div>
      <div className="past-reservation">
        <div className="info-title">지난 예약내역</div>
        {pastReservations.length > 0 ? (
          pastReservations.map((res) => renderReservation(res))
        ) : (
          <div>지난 예약 내역이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default MyReservationCont;
