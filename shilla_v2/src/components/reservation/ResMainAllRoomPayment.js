import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../scss/paymentPage.module.scss";
import { loadTossPayments } from "@tosspayments/payment-sdk";

function AllRoomPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 세션에서 로그인된 사용자 ID 가져오기
  const memberId = sessionStorage.getItem("id");

  // 데이터를 갖고옴
  const {
    reservationDate,
    checkInDate,
    checkOutDate,
    roomType,
    roomId,
    productId,
    paySum,
    adultCount,
    childrenCount,
  } = location.state || {};

  console.log("체크인, 체크아웃 날짜 : ", reservationDate);
  console.log("객실 : ", roomType);
  console.log("paySum : ", paySum);
  console.log("product_id : ", productId);

  const clientKey = "test_ck_EP59LybZ8BwNvPWGkOGY36GYo7pR"; // 클라이언트 키

  let lastOrderDate = "";
  let usedOrderNumbers = new Set(); // 사용된 주문 번호를 저장

  function generateOrderNum() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    // 날짜가 바뀌면 초기화
    if (formattedDate !== lastOrderDate) {
      lastOrderDate = formattedDate;
      usedOrderNumbers.clear(); // 중복 방지를 위한 기록 초기화
    }

    let randomNumberSuffix;
    do {
      // 8자리 랜덤 숫자 생성
      randomNumberSuffix = String(
        Math.floor(Math.random() * 1_0000_0000)
      ).padStart(8, "0");
    } while (usedOrderNumbers.has(randomNumberSuffix)); // 중복이면 다시 생성

    usedOrderNumbers.add(randomNumberSuffix); // 생성된 번호 저장

    return `${formattedDate}-${randomNumberSuffix}`;
  }

  const handleTossPayment = async () => {
    if (!memberId) {
      alert("모든 내용을 작성해주세요");
      return;
    }

    try {
      // 주문 번호와 결제 금액 설정
      const orderNum = generateOrderNum();
      console.log(orderNum);

      const startDate = checkInDate
      const endDate = checkOutDate

      // 토스페이먼츠 결제창 로드
      const tossPayments = await loadTossPayments(clientKey);
      if (!tossPayments || typeof tossPayments.requestPayment !== "function") {
        throw new Error(
          "tossPayments 객체가 초기화되지 않았거나 requestPayment 메서드가 없습니다"
        );
      }
      tossPayments
        .requestPayment("카드", {
          amount: paySum, // 결제 금액
          orderId: orderNum, // 고유 주문 ID
          orderName: roomType, // 상품명
          customerName: "홍길동", // 구매자 이름
          successUrl: window.location.origin + "/success",
          failUrl: window.location.origin + "/fail",
          card: {
            useEscrow: false,
            flowMode: "DEFAULT", // 통합결제창 여는 옵션
            useCardPoint: false,
            useAppCardOnly: false,
          },
          metadata: {
            reservationInfo: JSON.stringify({
              startDate,
              endDate,
              roomType,
              roomId,
              productId,
              paySum,
              adultCount,
              childrenCount,
              orderName: roomType, // orderName 설정
              customerName: "홍길동", // customerName 설정
              paymentMethod: "card", // 결제 방법 추가
            }),
          },
        })
        .then(async () => {
          // 함수가 실행되면 Toss api
        })
        .catch((error) => {
          console.error("결제창 오류:", error);
          if (error.code === "USER_CANCEL") {
            alert("결제가 취소되었습니다.");
          } else {
            alert("결제창을 열 수 없습니다. 다시 시도해주세요");
          }
        });
    } catch (error) {
      console.error("결제 요청 오류:", error);
      throw error;
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.paymentContainer}>
      <h2>결제정보</h2>
      <form className={styles.paymentForm}>
        <div className={styles.reserveDate}> 예약날짜 : {checkInDate} ~ {checkOutDate}</div>
        <div className={styles.roomType}>
          {" "}
          룸이름 : {roomType} [{roomId}호]
        </div>
        <div className={styles.avaCount}>
          {" "}
          이용인원 : 성인: {adultCount} 어린이: {childrenCount}
        </div>
        <p className={styles.totPrice}>
          총 결제 금액: {paySum.toLocaleString()}원
        </p>
      </form>
      <div className={styles.buttonContainer}>
        <button onClick={handleTossPayment}>결제하기</button>
        <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
}
export default AllRoomPaymentPage;
