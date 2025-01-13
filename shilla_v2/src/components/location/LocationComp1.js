import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LocationComp1 = () => {
    const [keyword, setKeyword] = useState(""); // 검색어 상태
    const [map, setMap] = useState(null); // Kakao 지도 객체
    const [ps, setPs] = useState(null); // 장소 검색 서비스 객체
    const [searchMarkers, setSearchMarkers] = useState([]); // 검색된 마커 저장

    useEffect(() => {
        const initializeMap = () => {
            if (window.kakao && window.kakao.maps) {
                const { kakao } = window;

                const container = document.getElementById("map");
                const options = {
                    center: new kakao.maps.LatLng(37.5558806, 127.0051533), // 신라호텔 좌표
                    level: 3,
                };

                const map = new kakao.maps.Map(container, options);
                setMap(map);

                const ps = new kakao.maps.services.Places(); // 장소 검색 객체 생성
                setPs(ps);

                // 신라호텔 마커 추가
                const markerPosition = new kakao.maps.LatLng(37.5558806, 127.0051533);
                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    map: map,
                });

                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;">신라호텔</div>`,
                });

                kakao.maps.event.addListener(marker, "click", () => {
                    const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(
                        "신라호텔"
                    )},${markerPosition.getLat()},${markerPosition.getLng()}`;
                    window.open(kakaoMapUrl, "_blank");
                });

                infowindow.open(map, marker); // 초기 정보 창 열기
            } else {
                console.error("Kakao Maps API is not available.");
            }
        };

        const loadKakaoMapScript = () => {
            if (!document.querySelector(`script[src="//dapi.kakao.com/v2/maps/sdk.js?appkey=daecfc090fcf9f20e5c231d1a72c3594"]`)) {
                const script = document.createElement("script");
                script.src =
                    "//dapi.kakao.com/v2/maps/sdk.js?appkey=daecfc090fcf9f20e5c231d1a72c3594&libraries=services&autoload=false";
                script.async = true;
                script.onload = () => {
                    window.kakao.maps.load(initializeMap);
                };
                document.head.appendChild(script);
            } else {
                window.kakao.maps.load(initializeMap);
            }
        };

        loadKakaoMapScript();
    }, []);

    const searchPlaces = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                // 검색 결과 마커 제거
                searchMarkers.forEach((marker) => marker.setMap(null));
                setSearchMarkers([]);

                // 검색 결과 마커 추가
                const newMarkers = data.map((place) => {
                    const marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(place.y, place.x),
                    });

                    const infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
                    });

                    // 마커 클릭 시 카카오맵 열기
                    kakao.maps.event.addListener(marker, "click", () => {
                        const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(
                            place.place_name
                        )},${place.y},${place.x}`;
                        window.open(kakaoMapUrl, "_blank");
                    });

                    infowindow.open(map, marker);
                    return marker;
                });

                setSearchMarkers(newMarkers);

                // 검색 결과의 첫 번째 장소로 지도 이동
                const bounds = new kakao.maps.LatLngBounds();
                data.forEach((place) =>
                    bounds.extend(new kakao.maps.LatLng(place.y, place.x))
                );
                map.setBounds(bounds);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                alert("검색 결과가 없습니다.");
            } else {
                alert("검색 중 오류가 발생했습니다.");
            }
        });
    };

    const resetMap = () => {
        if (map) {
            const center = new kakao.maps.LatLng(37.5558806, 127.0051533);
            map.setCenter(center);

            // 검색 마커 제거
            searchMarkers.forEach((marker) => marker.setMap(null));
            setSearchMarkers([]);
        }
    };

    return (
        <>
            <div className="sub-title">
                <h2>오시는 길</h2>
                <ul className="location">
                    <li><Link to="/">홈</Link></li>
                    <li><Link to="/location">오시는 길</Link></li>
                </ul>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="장소를 검색하세요"
                    style={{
                        padding: "10px",
                        width: "300px",
                        marginRight: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <button
                    onClick={searchPlaces}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                >
                    검색
                </button>
                <button
                    onClick={resetMap}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    초기화
                </button>
            </div>
            <div
                id="map"
                style={{
                    width: "100%",
                    height: "500px",
                    marginTop: "20px",
                }}
            ></div>
        </>
    );
};

export default LocationComp1;