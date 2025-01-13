import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar"; // Google Calendar 플러그인 추가

const DayGridView = ({reservations}) => {

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <style>
        {`
          .fc-event-time {
            display: none;
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin]} // Google Calendar 플러그인 포함
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prevYear,prev,next,nextYear today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        initialDate={new Date()} // 오늘 날짜로 설정
        navLinks={true}
        editable={true}
        dayMaxEvents={true}
        events={reservations}
        googleCalendarApiKey="AIzaSyCk-hIkT2m_u-zDB0aLVyFFF_7gmNdyWaY" // Google Calendar API 키
        eventSources={[
          {
            googleCalendarId:
              "5bbee420cab5c6ca04f16c53eaf7b51345a63c30d1abd7bf4866680c52079235@group.calendar.google.com",
            className: "google-event", // Google Calendar 이벤트에 추가 스타일 클래스
            color: "#F29661", // Google Calendar 일정에 대한 색상 설정
            textColor: "#ffffff", // 텍스트 색상
          },
        ]}
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault(); // 기본 동작 차단
            info.event.setProp("url", null); // 링크 속성 제거
          }
        }}
      />
    </div>
  );
};

export default DayGridView;