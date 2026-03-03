/**
 * map_upgrade.js - 리액트 연동 버전
 */

// 전역 변수 선언
var map = null;
var myMarker = null;
var polyline = null;
var routeSteps = [];
var lastSpokenStep = -1;

// 🚀 [핵심 수정] 지도를 그리는 기능을 함수로 감쌌습니다.
// 로그인 후 <div id="map">이 생기면 리액트가 이 함수를 호출할 겁니다.
window.initMap = function() {
    var container = document.getElementById('map');
    if (!container) {
        console.error("지도를 그릴 영역(div#map)을 찾지 못했습니다.");
        return;
    }

    var options = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 4 };
    map = new kakao.maps.Map(container, options);
    console.log("카카오맵 초기화 완료!");
};

// 🔊 음성 출력 함수
function speak(text) {
    var subtitleBox = document.getElementById('subtitle-box');
    if (subtitleBox) subtitleBox.innerHTML = "🔊 " + text;

    if (typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel();
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = "ko-KR";
    msg.rate = 1.0; 
    window.speechSynthesis.speak(msg);
}

// 🚶 길찾기 로직 (간소화된 예시)
window.findRoute = function(lat, lng, shelterName) {
    if (!map) return;
    
    // 내 위치 가짜 설정 (테스트용: 시청역)
    var startLat = 37.5657;
    var startLng = 126.9769;

    speak(shelterName + "으로 안내를 시작합니다.");

    // 지도 중심 이동
    var moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    
    // 경로 그리기 (단순 직선 예시)
    if (polyline) polyline.setMap(null);
    var linePath = [
        new kakao.maps.LatLng(startLat, startLng),
        new kakao.maps.LatLng(lat, lng)
    ];
    polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FFAE00',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
    });
    polyline.setMap(map);
};

// 📍 마커 찍기 함수 (파이썬 데이터 연동)
window.initMarkers = function(shelterData) {
    if (!map) {
        console.error("지도가 아직 생성되지 않았습니다.");
        return;
    }
    
    // 기존 마커 초기화 코드가 필요하다면 추가
    shelterData.forEach(function(s) {
        var markerPosition  = new kakao.maps.LatLng(s.lat, s.lng); 
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);

        // 클릭 이벤트
        kakao.maps.event.addListener(marker, 'click', function() {
            window.findRoute(s.lat, s.lng, s.name);
        });
    });
    console.log(shelterData.length + "개의 쉼터 마커 생성 완료");
};
