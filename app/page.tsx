"use client";
import { useState } from "react";
import Script from "next/script";

// 타입스크립트 에러 방지용 선언
declare global {
  interface Window {
    kakao: any;
    initMap: any;     // 우리가 js 파일에 만든 함수
    initMarkers: any; // 우리가 js 파일에 만든 함수
    findRoute: any;
  }
}

export default function Home() {
  // 상태 관리
  const [isLogin, setIsLogin] = useState(false);       // 로그인 성공 여부 (지도 화면 vs 로그인 화면)
  const [isSignupMode, setIsSignupMode] = useState(false); // 로그인 폼 vs 회원가입 폼 토글
  const [userName, setUserName] = useState("");        // 사용자 이름

  // 입력값들
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [address, setAddress] = useState("");
  
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 1. 로그인 처리
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
        setUserName(result.username); // 💡 서버에서 받은 이름을 상태에 저장
        setIsLogin(true);             // 지도 화면으로 전환
      } else {
        alert("로그인 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패! 터미널에서 uvicorn이 켜져 있는지 확인하세요.");
    }
  };

  // 2. 회원가입 처리
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
        setIsSignupMode(false); // 가입 성공하면 로그인 창으로 돌아가기
      } else {
        alert("가입 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  // 스타일
  const inputStyle = { width: '90%', padding: '12px', margin: '8px 0', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' };
  const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px', fontWeight: 'bold' };
  const linkStyle = { color: '#3498db', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' };

  return (
    <div style={{ fontFamily: '"Malgun Gothic", sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 🅰️ 로그인 전 화면 (로그인 폼 <-> 회원가입 폼 토글) */}
      {!isLogin && (
        <div style={{ paddingTop: '80px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', width: '350px', margin: '0 auto', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>👵 세이프 패스</h2>
            <p style={{ color: '#95a5a6', marginBottom: '30px' }}>어르신 안심 쉼터 안내 서비스</p>

            {/* 토글 로직: isSignupMode가 false면 로그인창, true면 회원가입창 */}
            {!isSignupMode ? (
              // [로그인 모드]
              <div>
                <input type="text" placeholder="아이디" style={inputStyle} onChange={(e) => setLoginId(e.target.value)} />
                <input type="password" placeholder="비밀번호" style={inputStyle} onChange={(e) => setLoginPw(e.target.value)} />
                <button onClick={handleLogin} style={buttonStyle}>로그인</button>
                
                <p style={{ marginTop: '20px' }}>
                  아직 계정이 없으신가요? <br/>
                  <span onClick={() => setIsSignupMode(true)} style={linkStyle}>회원가입 하러가기</span>
                </p>
              </div>
            ) : (
              // [회원가입 모드]
              <div>
                <input type="text" placeholder="사용할 아이디" style={inputStyle} onChange={(e) => setUserid(e.target.value)} />
                <input type="password" placeholder="비밀번호" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder="이름 (예: 홍길동)" style={inputStyle} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="출생연도 (예: 1955)" style={inputStyle} onChange={(e) => setBirthyear(e.target.value)} />
                <input type="text" placeholder="주소 (예: 종로구 혜화동)" style={inputStyle} onChange={(e) => setAddress(e.target.value)} />
                
                <button onClick={handleSignup} style={{ ...buttonStyle, backgroundColor: '#3498db' }}>가입 완료</button>
                
                <p style={{ marginTop: '20px' }}>
                  이미 계정이 있으신가요? <br/>
                  <span onClick={() => setIsSignupMode(false)} style={linkStyle}>로그인 하러가기</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🅱️ 로그인 후 화면 (지도 & 상단바) */}
      {isLogin && (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          
          {/* 상단바: 사용자 이름 표시 */}
          <div style={{ 
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '15px 20px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
              👋 안녕하세요, <span style={{color: '#4CAF50'}}>{userName}</span>님!
            </span>
            <button onClick={() => setIsLogin(false)} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              로그아웃
            </button>
          </div>

          {/* 지도 영역 (이 ID가 있어야 map_upgrade.js가 작동함) */}
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
          
          {/* 하단 안내 메시지 */}
          <div id="subtitle-box" style={{
            position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
            width: '85%', maxWidth: '500px', backgroundColor: 'rgba(0,0,0,0.85)', color: '#FFD700',
            padding: '15px', borderRadius: '30px', fontSize: '18px', zIndex: 20, textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            👆 지도에 있는 쉼터를 클릭해보세요!
          </div>

          {/* 1. 카카오맵 SDK 로드 */}
          <Script 
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=53573d8bf722b4bc75ea45fd95a4ed3c&libraries=services&autoload=false"
            onLoad={() => {
              window.kakao.maps.load(() => {
                // 2. 우리가 만든 map_upgrade.js가 로드되었는지 확인 후 지도 생성
                if (window.initMap) {
                    window.initMap(); // 지도 그리기 시작!
                    
                    // 3. 지도 그려진 뒤, DB에서 데이터 가져와서 마커 찍기
                    fetch("http://127.0.0.1:8000/api/shelters")
                      .then(res => res.json())
                      .then(data => {
                         if(window.initMarkers) window.initMarkers(data);
                      });
                } else {
                    console.error("map_upgrade.js가 아직 로드되지 않았습니다.");
                }
              });
            }}
          />
          
          {/* 2. map_upgrade.js 로드 (지도 기능 파일) */}
          <Script src="/map_upgrade.js" strategy="afterInteractive" />
        </div>
      )}
    </div>
  );
}
