import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassWord(e.target.value);
  };
  //登入
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5182/api/user/login", {
        userName: userName,
        password: password,
      });
      const Token = response.data.token;
      localStorage.setItem("Token", Token);
      setIsLoggedIn(true);
      alert("登入成功");
      navigate("/");
    } catch (error) {
      alert("登入失敗");
      console.log("登入失敗", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-inputbox-container">
        <input
          onChange={handleUserNameChange}
          value={userName}
          placeholder="輸入暱稱"
          type="text"
        />
        <input
          onChange={handlePasswordChange}
          value={password}
          placeholder="輸入密碼"
          type="password"
        />
        <div className="login-button-container">
          <button onClick={() => navigate("/")}>返回</button>
          <button onClick={handleLogin}>登入</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
