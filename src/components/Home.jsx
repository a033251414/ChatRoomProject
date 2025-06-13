import Grouplist from "./HomeLayout/GroupList";
import MessageList from "./HomeLayout/MessageList";
import UserList from "./HomeLayout/UserList";
import MessageInput from "./HomeLayout/MessageInput";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const Home = ({ setIsLoggedIn, isLoggedIn }) => {
  const navigate = useNavigate();
  //在輸入訊息後重新渲染
  const [refreshMessage, setRefreshMessage] = useState(false);
  //在創建群組後後重新渲染
  const [groupChange, setGroupChange] = useState("");
  //群組名稱標題
  const [groupTitle, setGroupTitle] = useState("");
  //登入的Username，用於對發送訊息的Username比對，如果名字一樣訊息顯示在右邊
  const [userName, setUserName] = useState("");
  //抓取token保持登入中
  const token = localStorage.getItem("Token");

  //抓取user資料
  useEffect(() => {
    async function GetUser() {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.Id;
        const response = await axios.get(`http://localhost:5182/api/user/${userId}`);
        setUserName(response.data.userName);
      } catch (error) {
        console.log("抓取不到user資料", error);
      }
    }
    GetUser();
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });
  /*登出帳號*/
  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("GroupId");
    setIsLoggedIn(false);
    setGroupChange("");
    setGroupTitle("");
  };
  /*返回首頁*/
  const handleBackHome = () => {
    localStorage.removeItem("GroupId");
    setGroupChange("");
    setGroupTitle("");
  };

  return (
    <div>
      <div className="header-container">
        <div className="header-strip">
          <div className="back-container">
            <button onClick={handleBackHome}>返回</button>
          </div>
          <div className="title-container">{groupTitle}</div>
          {isLoggedIn ? (
            <div className="auth-container">
              <button onClick={handleLogout}>登出</button>
            </div>
          ) : (
            <div className="auth-container">
              <button
                onClick={() => {
                  navigate("/register");
                }}
              >
                註冊
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                }}
              >
                登入
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="chatroom-home">
        <div>
          <Grouplist setGroupChange={setGroupChange} setGroupTitle={setGroupTitle} isLoggedIn={isLoggedIn} />
        </div>
        <div>
          <MessageList refreshMessage={refreshMessage} groupChange={groupChange} userName={userName} />
          <MessageInput setRefreshMessage={setRefreshMessage} userName={userName} isLoggedIn={isLoggedIn} />
        </div>
        <div>
          <UserList />
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-strip"></div>
      </div>
    </div>
  );
};

export default Home;
