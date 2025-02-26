import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../scss/paymentSuccess.scss";
import Footer from "../common/Footer";
import Header from "../common/Header";

const bkURL = process.env.REACT_APP_BACK_URL;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [metadata, setMetadata] = useState(null);
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const memberId = sessionStorage.getItem("id");
  const [method, setMethod] = useState(null);
  const [provider, setProvider] = useState(null);

  // 결제 승인 및 metadata 가져오기
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.post(
          `${bkURL}/api/payment/confirm`,
          {
            paymentKey,
            orderId,
            amount,
          }
        );

        //     if (response.data && response.data.metadata) {
        //       setMetadata(response.data.metadata); // metadata 저장
        //     } else {
        //       console.error("Metadata를 받아올 수 없습니다.");
        //     }
        //   } catch (error) {
        //     console.error("결제 확인 중 오류 발생:", error);
        //     alert("결제를 확인하는 중 오류가 발생했습니다.");
        //   }
        // };
        if (response.data) {
          // Store metadata
          if (response.data.metadata) {
            setMetadata(response.data.metadata);
          }

          // Extract `method` and `provider`
          setMethod(response.data.method);
          if (response.data.easyPay) {
            setProvider(response.data.easyPay.provider);
          }
        } else {
          console.error("결제 정보를 받아올 수 없습니다.");
        }
      } catch (error) {
        console.error("결제 확인 중 오류 발생:", error);
        alert("결제를 확인하는 중 오류가 발생했습니다.");
      }
    };

    if (paymentKey && orderId && amount) {
      fetchPaymentDetails();
    }
  }, [paymentKey, orderId, amount]);

  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  };

  // 예약 테이블에 저장
  const handleReservation = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다");
      navigate("/login");
      return null;
    }

    if (!metadata) {
      console.error("Metadata가 로드되지 않았습니다.");
      return null;
    }

    const reservationData = {
      memberId: memberId,
      productId: metadata.productId, // metadata에서 가져옴
      startDate: metadata.startDate,
      endDate: metadata.endDate,
      totPrice: metadata.paySum,
      adultCnt: metadata.adultCount,
      childCnt: metadata.childrenCount,
      cancel: 0,
    };

    try {
      const response = await axios.post(
        `${bkURL}/reserve/save`,
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

  // 결제 테이블에 저장
  const handlePayment = async (reservationId) => {
    const paymentId = orderId;
    const paymentDate = addOneDay(new Date())
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const payment_key = paymentKey;
    console.log("결제 키:", payment_key);
    console.log("결제 방법:", metadata.paymentMethod);

    const paymentData = {
      paymentId: paymentId,
      reservationId: reservationId,
      paymentKey: payment_key,
      paymentMethod: metadata.paymentMethod,
      paymentDate: paymentDate,
      paymentAmount: amount,
      refund: "0",
      refundDate: null,
      refundAmount: null,
    };

    console.log(paymentData);

    try {
      const paymentResponse = await axios.post(
        `${bkURL}/reserve/savepayment`,
        paymentData
      );
      // if (paymentResponse.status === 201) {
      //   const userConfirmed = window.confirm("예약 내역을 확인하시겠습니까?");
      //   if (userConfirmed) {
      //     navigate("/myPage/myReservation");
      //   } else {
      //     navigate("/");
      //   }
      // } else {
      //   alert("결제 저장에 실패했습니다");
      // }
    } catch (error) {
      console.error("결제 저장 오류:", error);
      alert("서버에 연결할 수 없습니다.");
    }
  };

  const goMypgReserveBtn = () => {
    navigate("/myPage/myReservation");
  };

  // 예약 및 결제 처리
  useEffect(() => {
    const processReservationAndPayment = async () => {
      if (metadata) {
        const reservationId = await handleReservation();
        if (reservationId) {
          await handlePayment(reservationId);
        }
      }
    };

    processReservationAndPayment();
  }, [metadata]); // metadata가 업데이트된 후 실행

  return (
    <>
      <Header />
      <div className="paid-wrapper">
        {metadata ? (
          <div className="paid-container">
            <span>
              {metadata.customerName}님,
              <br /> 결제가 완료되었습니다.
            </span>
            <ul className="paid-list">
              <li>
                <p>주문번호</p> <p className="pright">{orderId}</p>
              </li>
              <li>
                <p>예약날짜</p>{" "}
                <p className="pright">
                  {metadata.startDate} ~ {metadata.endDate}
                </p>
              </li>
              <li>
                <p>객실타입</p>{" "}
                <p className="pright">
                  {metadata.roomType} [{metadata.roomId}
                  호]
                </p>
              </li>
              <li>
                <p>이용인원</p>{" "}
                <p className="pright">
                  성인:{metadata.adultCount}명, 어린이:{metadata.childrenCount}
                  명
                </p>
              </li>
              <li>
                <p>결제금액</p> <p className="pright">{metadata.paySum}원</p>
              </li>
              <li>
                <p>결제방식</p>{" "}
                <p className="pright">{method ? method : "인터넷 결제"}</p>
              </li>
              <li>
                <p>결제페이</p>{" "}
                <p className="pright">{provider ? provider : "간편결제"}</p>
              </li>
              <li>
                <p>판매자</p> <p className="pright">(주) 신라호텔</p>
              </li>
              <li>
                <p>상품문의</p> <p className="pright">02-2233-3131</p>
              </li>
            </ul>
            <div className="buttonContainer">
              <button className="" onClick={() => goMypgReserveBtn()}>
                내 예약조회
              </button>
            </div>
          </div>
        ) : (
          <p>결제 정보를 불러오는 중입니다...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
