"use client";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  // 🧺 사용자가 빈칸에 입력한 글자들을 담아둘 '바구니(State)'들입니다.
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [address, setAddress] = useState("");

  // 🚀 '가입 완료' 버튼을 누르면 실행되는 진짜 연결 함수!
  const handleSignup = async () => {
    // 1. 바구니에 담긴 데이터들을 파이썬이 좋아하는 규격으로 포장합니다.
    const userData = {
      userid: userid,
      password: password,
      name: name,
      birthyear: Number(birthyear), // 글자를 숫자로 바꿔줍니다!
      address: address
    };

    try {
      // 2. 파이썬 우체부(API)에게 포장한 데이터를 슝 쏩니다! (fetch)
      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      // 3. 파이썬이 "성공(ok)!"이라고 대답하면, 성공 알림을 띄웁니다.
      if (response.ok) {
        alert(result.message); 
        setIsLogin(true); // 성공했으니 다시 로그인 화면으로 돌려보냅니다.
      } else {
        alert("가입 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패! 파이썬 서버가 켜져 있는지 확인해주세요.");
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
          <div>
            <input type="text" placeholder="아이디를 입력하세요" style={inputStyle} />
            <input type="password" placeholder="비밀번호를 입력하세요" style={inputStyle} />
            <button onClick={() => alert('로그인 기능은 다음 미션입니다!')} style={buttonStyle}>로그인</button>
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(false)} style={linkStyle}>아직 회원이 아니신가요? 회원가입</span>
            </p>
          </div>
        ) : (
          <div>
            {/* onChange: 사용자가 글자를 칠 때마다 바구니에 담아주는 역할 */}
            <input type="text" placeholder="사용할 아이디" style={inputStyle} onChange={(e) => setUserid(e.target.value)} />
            <input type="password" placeholder="비밀번호" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="성함 (예: 홍길동)" style={inputStyle} onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="출생연도 (예: 1950)" style={inputStyle} onChange={(e) => setBirthyear(e.target.value)} />
            <input type="text" placeholder="동 이름 (예: 혜화동)" style={inputStyle} onChange={(e) => setAddress(e.target.value)} />
            
            {/* 🚀 방금 만든 진짜 연결 함수(handleSignup)를 버튼에 달아줍니다! */}
            <button onClick={handleSignup} style={{ ...buttonStyle, backgroundColor: '#3498db' }}>가입 완료</button>
            
            <p style={{ marginTop: '20px' }}>
              <span onClick={() => setIsLogin(true)} style={linkStyle}>로그인 화면으로 돌아가기</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
