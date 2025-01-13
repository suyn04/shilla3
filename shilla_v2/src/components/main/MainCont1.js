import {Link} from 'react-router-dom'
import { useState, useEffect } from "react"
import '../../scss/reset.css'
import '../../scss/common.scss'
import '../../scss/main.scss'

const MainCont1 = ({ weather, tomorrowWeather }) => {
    const [isToday, setIsToday] = useState(true); // true면 오늘, false면 내일

    useEffect(() => {
        // 5초 간격으로 오늘/내일 날씨를 번갈아 표시
        const interval = setInterval(() => {
            setIsToday(prev => !prev); // 상태 반전
        }, 5000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
    
    }, []);

    const getTomorrowWeatherValue = (category) => {
        return tomorrowWeather?.find((item) => item.category === category)?.fcstValue || '정보 없음';
    };

  return (
    <>
        {/*  s:// cont1. 메인 비주얼  */}
        <section className="cont1">

            {/* 날씨 정보 출력 */}
            <div className="weather-info">
                {weather && (
                <div>
                    <h4>오늘의 날씨</h4>
                    <p>기온: {weather.find(item => item.category === "T1H")?.obsrValue || "정보 없음"}℃</p>
                    <p>습도: {weather.find(item => item.category === "REH")?.obsrValue || "정보 없음"}%</p>
                    <p>강수량: {weather.find(item => item.category === "RN1")?.obsrValue || "0"}mm</p>
                </div>
                )}
            </div>

            <div className="swiper">
                <div className="swiper-wrapper">
                    <div className="swiper-slide slide1">
                        <div className="center">
                            <div className="txt-box">
                                <span>Members Only</span>
                                <h2><span>R</span>EWARDS <span>R</span>ELAX <span>S</span>PA <span>B</span>LISS</h2>
                                <p>몸과 마음을 편안하게 만들어주는 스파 프로그램으로 진정한 휴식을 느껴보세요.</p>
                            </div>
                            <Link to="/specialOffer/detail/56"  className="pkg-link">패키지 바로 가기</Link>
                        </div>
                    </div>
                    <div className="swiper-slide slide2">
                        <div className="center">
                            <div className="txt-box">
                                <span>Members Only</span>
                                <h2><span>R</span>EWARDS <span>P</span>RIVATE <span>M</span>OMENT AT <span>U</span>RBAN <span>C</span>ABANA</h2>
                                <p>어번 아일랜드의 프라이빗한 카바나에서 도심 속 휴식을 즐겨보세요.</p>
                            </div>
                            <Link to="/specialOffer/detail/59" className="pkg-link">패키지 바로 가기</Link>
                        </div>
                    </div>
                </div>
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-pagination"></div>
            </div>
        </section>
        {/*  e:// cont1. 메인 비주얼  */}
    </>
  )
}

export default MainCont1
