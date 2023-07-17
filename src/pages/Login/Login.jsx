import React, { useState } from "react";
import { Loginh1, LoginForm, NavStyle, FormBox } from "./LoginStyle";
import { useNavigate } from "react-router-dom"; // eslint-disable-line no-unused-vars
import BtnStyle from "../../components/Button/Button";
import UserInput from "../../components/UserInput/UserInput";

export default function Login() {

  const [userEmail, setUserEmail] = useState(""),
        [userPassword, setUserPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState(""); 
  const [emailWarining, setEmailWarining] = useState(""); 
  const [passwordWarining, setPasswordWarining] = useState(""); 

  const navigate = useNavigate();

  const inputHandler = (e) => {
    if (e.target.type === "email") {
      setUserEmail(e.target.value);
      if (validateEmail(e.target.value)) {
        setEmailWarining("");
      } else {
        setEmailWarining("올바른 이메일 형식이 아닙니다.");
      }
      setWarningMessage("");
    }
    if (e.target.type === "password") {
      setUserPassword(e.target.value);
      if (e.target.value.length < 6) {
        setPasswordWarining("비밀번호는 6자리 이상이어야 합니다.");
      } else {
        setPasswordWarining("");
      }
      setWarningMessage("");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    fetch("https://api.mandarin.weniv.co.kr/user/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        user: {
          email: userEmail,
          password: userPassword,
        },
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.user) {
          console.log(json);
          localStorage.setItem("token", json.user.token);
          localStorage.setItem("username", json.user.username);
          localStorage.setItem("accountname", json.user.accountname);
          navigate("/home");
        } else {
          setWarningMessage("이메일과 비밀번호가 일치하지 않습니다.");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <FormBox>
        <Loginh1>로그인</Loginh1>
        <LoginForm onSubmit={submitHandler}>
          <UserInput type="email" id="user-email" onChange={inputHandler} value={userEmail} >이메일</UserInput>
          <p style={{ color: "red", fontSize: "1.2rem", margin: " -1rem 0 3rem" }}>{emailWarining}</p>
          <UserInput type="password" id="user-password" onChange={inputHandler} value={userPassword}>비밀번호</UserInput>
          <p style={{ color: "red", fontSize: "1.2rem", margin: " -1rem 0 3rem" }}>{passwordWarining}</p>
          <div style={{height:"2rem"}}>
           <p style={{ color: "red", fontSize: "1.2rem", textAlign:"center"}}>{warningMessage}</p>
          </div>
          {userEmail && userPassword && !emailWarining && !passwordWarining ? (
            <BtnStyle type="submit" >
              로그인
            </BtnStyle>
          ) : (
            <BtnStyle type="submit" disabled >로그인</BtnStyle>
          )}
        </LoginForm>
        <NavStyle to={"/signup"}>이메일로 회원가입하기</NavStyle>
      </FormBox>
    </>
  );
}