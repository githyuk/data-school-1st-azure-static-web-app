"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");

  // 입력값들
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [address, setAddress] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 🚀 로그인 처리
  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: loginId, password: loginPw }),
      });
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        setUserName(result.username);
        setIsLogin(true); // 로그인 성공 -> 지도 화면 전환!
      } else {
        alert("로그인 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패! 파이썬 서버를 켜주세요.");
    }
  };

  // 🚀 회원가입 처리
  const handleSignup = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password, name, birthyear: Number(birthyear), address }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert("가입 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  return (
    <div style={{ fontFamily: '"Malgun Gothic", sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* === 1. 로그인 화면 === */}
      {!isLogin && (
        <div style={{ paddingTop: '50px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', width: '350px', margin: '0 auto', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c3e50' }}>👵 세이프 패스</h2>
            
            {/* 로그인 폼 */}
            <input type="text" placeholder="아이디" style={inputStyle} onChange={(e) => setLoginId(e.target.value)} />
            <input type="password" placeholder="비밀번호" style={inputStyle} onChange={(e) => setLoginPw(e.target.value)} />
            <button onClick={handleLogin} style={buttonStyle}>로그인</button>
            
            <hr style={{margin: '20px 0'}}/>
            
            {/* 회원가입 폼 */}
            <h3>회원가입</h3>
            <input type="text" placeholder="새 아이디" style={inputStyle} onChange={(e) => setUserid(e.target.value)} />
            <input type="password" placeholder="새 비밀번호" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="이름" style={inputStyle} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="출생연도" style={inputStyle} onChange={(e) => setBirthyear(e.target.value)} />
            <input type="text" placeholder="주소" style={inputStyle} onChange={(e) => setAddress(e.target.value)} />
            <button onClick={handleSignup} style={{ ...buttonStyle, backgroundColor: '#3498db' }}>가입하기</button>
          </div>
        </div>
      )}

      {/* === 2. 로그인 후 지도 화면 === */}
      {isLogin && (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          
          {/* 상단바 */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>👋 {userName}님</span>
            <button onClick={() => setIsLogin(false)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>로그아웃</button>
          </div>

          {/* 🗺️ 지도가 그려질 곳 */}
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
          
          {/* 🔊 TTS 자막 박스 (map_upgrade.js가 사용함) */}
          <div id="subtitle-box" style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '90%', backgroundColor: 'rgba(0,0,0,0.8)', color: 'yellow',
            padding: '15px', borderRadius: '10px', fontSize: '20px', zIndex: 20, textAlign: 'center'
          }}>
            지도를 클릭하여 쉼터를 선택해주세요.
          </div>

          {/* 📜 카카오맵 스크립트 로드 */}
          <Script 
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=53573d8bf722b4bc75ea45fd95a4ed3c&libraries=services&autoload=false"
            onLoad={() => {
              // 카카오맵이 로드되면 실행
              window.kakao.maps.load(() => {
                console.log("카카오맵 로드 완료!");
                
                // 1. 파이썬 서버에서 쉼터 데이터 가져오기
                fetch("http://127.0.0.1:8000/api/shelters")
                  .then(res => res.json())
                  .then(data => {
                    // 2. map_upgrade.js에 있는 함수 실행!
                    // (주의: map_upgrade.js가 아래 Script 태그로 로드되어야 합니다)
                    if (window.initMarkers) {
                        window.initMarkers(data);
                    } else {
                        console.error("initMarkers 함수를 찾을 수 없습니다.");
                    }
                  });
              });
            }}
          />
          {/* 우리가 만든 map_upgrade.js 로드 */}
          <Script src="/map_upgrade.js" strategy="beforeInteractive" />
        </div>
      )}
    </div>
  );
}

// 스타일
const inputStyle = { width: '90%', padding: '10px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '5px' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' };
