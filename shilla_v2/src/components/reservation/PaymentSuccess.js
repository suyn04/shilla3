import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName");
  const customerName = searchParams.get("customerName");
  const reservationDate = searchParams.get("reservationDate");
  const roomType = searchParams.get("roomType");
  const roomId = searchParams.get("roomId");
  const adultCount = searchParams.get("adultCount");
  const childrenCount = searchParams.get("childrenCount");
  const paySum = searchParams.get("paySum");
  const productId = searchParams.get("productId");

  const memberId = sessionStorage.getItem("id");

  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  const handleReservation = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    const reservationData = {
      memberId: memberId,
      productId: productId,
      startDate: reservationDate.split(" ~ ")[0],
      endDate: reservationDate.split(" ~ ")[1],
      totPrice: paySum,
      adultCnt: adultCount,
      childCnt: childrenCount,
      cancel: 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:5002/bk/reserve/save",
        reservationData
      );

      if (response.status === 201) {
        alert("예약이 완료되었습니다");
        return response.data.reservationId;
      } else {
        alert("예약 저장에 실패했습니다");
        return null;
      }
    } catch (error) {
      console.error("예약 저장 오류:", error);
      alert("서버에 연결할 수 없습니다. 다시 시도해주세요");
      return null;
    }
  };

  const handlePayment = async (reservationId) => {
    const paymentId = orderId
    const paymentDate = addOneDay(new Date())
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const paymentData = {
      paymentId: paymentId,
      reservationId: reservationId,
      paymentDate: paymentDate,
      paymentAmount: amount,
      refund: "0",
      refundDate: null,
      refundAmount: null,
    };

    try {
      const paymentResponse = await axios.post(
        "http://localhost:5002/bk/reserve/savepayment",
        paymentData
      );

      if (paymentResponse.status === 201) {
        const userConfirmed = window.confirm("예약 내역을 확인하시겠습니까?");
        if (userConfirmed) {
          navigate("/myPage/myReservation");
        } else {
          navigate("/");
        }
      } else {
        alert("결제 저장에 실패했습니다");
      }
    } catch (error) {
      console.error("결제 저장 오류:", error);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5002/api/payment/confirm",
        {
          paymentKey,
          orderId,
          amount,
          orderName,
          customerName,
        }
      );
      alert("결제가 완료되었습니다!");

      // 예약 및 결제 table에 데이터 추가가
      const reservationId = await handleReservation();
      if (reservationId) {
        await handlePayment(reservationId);
      }
    } catch (error) {
      console.error("예약 및 결제 table 데이터 추가 에러:", error);
      alert("예약 및 결제 table 데이터 추가 에러");
    }
  };

  useEffect(() => {
    if (paymentKey && orderId && amount && orderName && customerName) {
      confirmPayment();
    }
  }, [paymentKey, orderId, amount, orderName, customerName]);

  return (
    <div>
      <h1>결제가 완료되었습니다!</h1>
      <div>
        <p><strong>주문번호:</strong> {orderId}</p>
        <p><strong>결제 객실:</strong> {orderName}</p>
        <p><strong>고객이름:</strong> {customerName}</p>
        <p><strong>결제된 가격:</strong> {amount}원</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
