import Grouplist from "./HomeLayout/GroupList";
import MessageList from "./HomeLayout/MessageList";
import MessageSearch from "./HomeLayout/MessageSearch";
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
  //變換聊天室用*取得群組ID
  const [groupChange, setGroupChange] = useState("");
  //群組名稱標題
  const [groupTitle, setGroupTitle] = useState("");
  //登入的Username，用於對發送訊息的Username比對，如果名字一樣訊息顯示在右邊
  const [userName, setUserName] = useState("");
  //抓取token保持登入中
  const token = localStorage.getItem("Token");
  //雙向通訊
  const [connection, setConnection] = useState(null);
  //抓取的群組訊息
  const [messages, setMessages] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  //回覆訊息
  const [replyMessage, setReplyMessage] = useState(null);

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
    setMessages([]);
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

  //啟動SignalR 並接收訊息
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");

          connection.on("ReceiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
          });

          //監聽收回訊息
          connection.on("ReceiveRecalledMessage", (messageId) => {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.id == messageId ? { ...msg, content: null } : msg))
            );
          });
        })

        .catch((err) => console.error("SignalR Connection Error:", err));
    }
  }, [connection]);

  // //切換SignalR群組
  useEffect(() => {
    const newGroupId = localStorage.getItem("GroupId");
    if (connection && connection.state === "Connected" && newGroupId) {
      const switchGroup = async () => {
        if (currentGroupId && currentGroupId !== newGroupId) {
          await connection.invoke("LeaveGroup", currentGroupId);
          console.log(`離開群組：${currentGroupId}`);
        }

        await connection.invoke("JoinGroup", newGroupId);
        console.log(`加入群組：${newGroupId}`);
        setCurrentGroupId(newGroupId);
      };

      switchGroup();
    }
  }, [groupChange]);

  //監聽訊息傳送
  const sendMessage = async (groupId, messageObj) => {
    if (connection && connection.state === "Connected") {
      try {
        await connection.invoke("SendMessage", groupId, messageObj);
      } catch (error) {
        console.log("SignalR傳送錯誤", error);
      }
    }
  };
  //監聽訊息收回
  const recallMessage = async (groupId, messageId) => {
    if (connection && connection.state === "Connected") {
      try {
        await connection.invoke("RecallMessage", groupId, messageId);
        console.log("已呼叫 RecallMessage");
      } catch (error) {
        console.error("呼叫 RecallMessage 失敗:", error);
      }
    }
  };

  return (
    <div>
      <header className="header-container">
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
      </header>

      <main className="chatroom-home">
        <nav>
          <Grouplist
            setGroupChange={setGroupChange}
            setGroupTitle={setGroupTitle}
            isLoggedIn={isLoggedIn}
          />
        </nav>
        <section>
          <MessageList
            refreshMessage={refreshMessage}
            groupChange={groupChange}
            userName={userName}
            messages={messages}
            setMessages={setMessages}
            setReplyMessage={setReplyMessage}
            replyMessage={replyMessage}
            recallMessage={recallMessage}
          />
          <MessageInput
            userName={userName}
            isLoggedIn={isLoggedIn}
            setRefreshMessage={setRefreshMessage}
            setMessages={setMessages}
            groupChange={groupChange}
            sendMessage={sendMessage}
            setReplyMessage={setReplyMessage}
            replyMessage={replyMessage}
          />
        </section>
        <section>
          <MessageSearch groupChange={groupChange} isLoggedIn={isLoggedIn} />
        </section>
      </main>
      <footer className="footer-container">
        <div className="footer-strip"></div>
      </footer>
    </div>
  );
};

export default Home;
