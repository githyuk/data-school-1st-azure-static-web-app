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

  // 🧺 로그인용 바구니
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 🚀 회원가입 함수
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

  // 🚀 로그인 함수
  const handleLogin = async () => {
    const loginData = { userid: loginId, password: loginPw };
    try {
      const response = await fetch("
