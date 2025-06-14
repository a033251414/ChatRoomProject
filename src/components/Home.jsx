import Grouplist from "./HomeLayout/GroupList";
import MessageList from "./HomeLayout/MessageList";
import UserList from "./HomeLayout/UserList";
import MessageInput from "./HomeLayout/MessageInput";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
//雙向
import * as signalR from "@microsoft/signalr";

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
  //雙向
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  //抓取user資料
  useEffect(() => {
    async function GetUser() {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.Id;
        const response = await axios.get(
          `https://charroom-backend.onrender.com/api/user/${userId}`
        );
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

  //雙向
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://charroom-backend.onrender.com/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");

          connection.on("ReceiveMessage", (userName, message) => {
            setMessages((prev) => [...prev, { userName: userName, content: message }]);
          });
        })
        .catch((err) => console.error("SignalR Connection Error:", err));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    if (connection && connection.state === "Connected") {
      await connection.invoke("SendMessage", user, message);
    }
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
          <Grouplist
            setGroupChange={setGroupChange}
            setGroupTitle={setGroupTitle}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <div>
          <MessageList
            refreshMessage={refreshMessage}
            groupChange={groupChange}
            userName={userName}
            messages={messages}
            setMessages={setMessages}
          />
          <MessageInput
            userName={userName}
            isLoggedIn={isLoggedIn}
            setRefreshMessage={setRefreshMessage}
            /*雙向*/ sendMessage={sendMessage}
          />
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
