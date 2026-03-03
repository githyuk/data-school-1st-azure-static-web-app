"use client";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  // 🧺 가입용 바구니
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [address, setAddress] = useState("");

  // 🧺 로그인용 바구니 (새로 추가됨!)
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 🚀 회원가입 함수 (아까 성공하신 그 코드!)
  const handleSignup = async () => {
    const userData = { userid: userid, password: password, name: name, birthyear: Number(birthyear), address: address };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message); 
        setIsLogin(true); // 성공하면 로그인 화면으로 이동
      } else {
        alert("가입 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  // 🚀 로그인 함수 (새로 추가됨!)
  const handleLogin = async () => {
    const loginData = { userid: loginId, password: loginPw };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message); // 로그인 성공 알림!
        // 로그인 성공 후 화면을 바꾸고 싶다면 여기에 코드를 추가하면 됩니다.
      } else {
        alert("로그인 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  // 디자인 설정
  const inputStyle = { width: '90%', padding: '15px', margin: '10px 0', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px' };
  const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#4CAF50', color: 'white', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
  const linkStyle = { color: '#3498db', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' };

  return (
    <div style={{ fontFamily: '"Malgun Gothic", sans-serif', textAlign: 'center', backgroundColor: '#f4f7f6', minHeight: '100vh', paddingTop: '50px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '40px', width: '350px', margin: '0 auto', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#2c3e50', margin: '0 0 10px 0' }}>👵 세이프 패스</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>어르신 안심 쉼터 안내 서비스</p>

        {isLogin ? (
          /* ================= 로그인 화면 ================= */
          <div>
            <input type="text" placeholder="아이디를 입력하세요" style={inputStyle} onChange={(e) => setLoginId(e.target.value)} />
            <input type="password" placeholder="비밀번호를 입력하세요" style={inputStyle} onChange={(e) => setLoginPw(e.target.value)} />
            <button onClick={handleLogin} style={buttonStyle}>로그인</button>
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(false)} style={linkStyle}>아직 회원이 아니신가요? 회원가입</span>
            </p>
          </div>
        ) : (
          /* ================= 회원가입 화면 ================= */
          <div>
            <input type="text" placeholder="사용할 아이디" style={inputStyle} onChange={(e) => setUserid(e.target.value)} />
            <input type="password" placeholder="비밀번호" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="성함 (예: 홍길동)" style={inputStyle} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="출생연도 (예: 1950)" style={inputStyle} onChange={(e) => setBirthyear(e.target.value)} />
            <input type="text" placeholder="동 이름 (예: 혜화동)" style={inputStyle} onChange={(e) => setAddress(e.target.value)} />
            
            <button onClick={handleSignup} style={{ ...buttonStyle, backgroundColor: '#3498db' }}>가입 완료</button>
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(true)} style={linkStyle}>로그인 화면으로 돌아가기</span>
            </p>
          </div>
        )}
      </div>
    </div>
   

      {/* 👇 [여기서부터 복사] 구분선과 깃허브 링크 버튼 */}
      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />
      
      <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
        이 서비스의 <strong>소스 코드</strong>가 궁금하신가요?
      </p>
      
      <a 
        href="https://github.com/githyuk/data-school-1st-azure-static-web-app.git" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 25px', 
          backgroundColor: '#24292e', // 깃허브 공식 색상 (다크)
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '8px',
          fontSize: '15px',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000'} // 마우스 올리면 더 진하게
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#24292e'}
      >
        {/* 깃허브 아이콘 대신 텍스트로 심플하게 표현 */}
        🐙 GitHub Repository 방문하기
      </a>
      {/* 👆 [여기까지 복사] */}

    </div>
  </div>
  );
}
