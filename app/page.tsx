"use client";
import { useState } from "react";

export default function Home() {
  // 로그인 화면과 회원가입 화면을 전환하는 스위치 역할
  const [isLogin, setIsLogin] = useState(true);

  // 디자인 스타일 세팅
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
            <input type="text" placeholder="아이디를 입력하세요" style={inputStyle} />
            <input type="password" placeholder="비밀번호를 입력하세요" style={inputStyle} />
            <button onClick={() => alert('데이터베이스 연결 준비 중입니다!')} style={buttonStyle}>로그인</button>
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(false)} style={linkStyle}>아직 회원이 아니신가요? 회원가입</span>
            </p>
          </div>
        ) : (
          /* ================= 회원가입 화면 ================= */
          <div>
            <input type="text" placeholder="사용할 아이디" style={inputStyle} />
            <input type="password" placeholder="비밀번호" style={inputStyle} />
            <input type="text" placeholder="성함 (예: 홍길동)" style={inputStyle} />
            <input type="number" placeholder="출생연도 (예: 1950)" style={inputStyle} />
            <input type="text" placeholder="동 이름 (예: 혜화동)" style={inputStyle} />
            <button onClick={() => alert('회원가입 버튼을 눌렀습니다!')} style={{ ...buttonStyle, backgroundColor: '#3498db' }}>가입 완료</button>
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(true)} style={linkStyle}>로그인 화면으로 돌아가기</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
