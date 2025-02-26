import React, { useEffect, useState } from "react";
import "../../../scss/admin.scss";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import AdminTabMenu from "../AdminTabMenu";
import AdminTodayRes from "./AdminTodayRes";
      
      const AdminReservation = () => {
        const bkURL = process.env.REACT_APP_BACK_URL;
        const [todayReservations, setTodayReservations] = useState([]);
        const [cancelledReservations, setCancelledReservations] = useState([])
      
        useEffect(() => {
          document.title = "신라호텔: 관리자";
      
          // 오늘 날짜 가져오기
          const today = new Date().toISOString().split("T")[0];  // 오늘 날짜만 사용
      
          // DB에서 오늘 예약 정보를 가져오는 API 호출
          axios
            .get(`${bkURL}/admin/reservation?date=${today}`)
            .then((response) => {
              setTodayReservations(response.data);  // 서버 응답 데이터 설정
            })
            .catch((error) => {
              console.error("오늘 예약 가져오기 실패 :", error);
            });
      
          // db에서 오늘 취소된 예약 정보 가져오기
          axios.get(`${bkURL}/admin/reservation/cancelled`)
          .then((response) =>{
            setCancelledReservations(response.data)
          })
          .catch((error) => {
            console.log("취소된 예약 가져오기 실패", error)
      
          })
          }, []);
      
        return (
          <> 
            <Header />
            <div className="admin-wrap">
              <div className="center">
                <AdminTabMenu />
                <div className="tab-contents">
                  <AdminTodayRes 
                    todayReservations={todayReservations}
                    cancelledReservations={cancelledReservations} />
                </div>
              </div>
            </div>
            <Footer />
          </>
        );
      };
      
      export default AdminReservation;
