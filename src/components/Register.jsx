import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [conirmPassword, setConirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isNickName = localStorage.getItem("NickName");
    if (isNickName) {
      navigate("/home");
    }
  }, []);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConirmPasswordChange = (e) => {
    setConirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!userName) {
        alert("請輸入使用者暱稱");
      } else if (password.length < 6) {
        alert("密碼至少6字元以上");
      } else if (password !== conirmPassword) {
        alert("密碼不一致");
      } else {
        const response = await axios.post("https://charroom-backend.onrender.com/api/user", {
          UserName: userName,
          Password: password,
        });
        localStorage.setItem("Token", response.data.token);
        alert("創建成功");
        navigate("/login");
        console.log("創建成功");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        console.log("無法連上伺服器");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-inputbox-container">
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
        <input
          onChange={handleConirmPasswordChange}
          value={conirmPassword}
          placeholder="確認密碼"
          type="password"
        />
        <div className="register-button-container">
          <button onClick={() => navigate("/")}>返回</button>
          <button onClick={handleSubmit}>創建帳號</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
