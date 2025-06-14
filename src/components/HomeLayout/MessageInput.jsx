import axios from "axios";
import React, { useState } from "react";
const MessageInput = ({ userName, isLoggedIn, setRefreshMessage, /*雙向*/ sendMessage }) => {
  const [message, setMessage] = useState("");
  const GroupId = localStorage.getItem("GroupId");
  const handleInputMessage = (e) => {
    setMessage(e.target.value);
  };

  //傳送訊息
  const handleEnterMessage = async () => {
    try {
      if (message == "") {
        console.log("請勿傳空白字元");
      } else {
        console.log(userName);
        console.log(userName, message);
        setRefreshMessage((prev) => !prev);
        sendMessage(userName, message);
        setMessage("");
        await axios.post("https://charroom-backend.onrender.com/api/messages", {
          groupId: GroupId,
          userName: userName,
          content: message,
        });

        console.log("傳送訊息成功");
      }
    } catch (error) {
      console.log("訊息傳送失敗", error);
    }
  };

  return (
    <div className="message-input-container">
      {isLoggedIn ? (
        <div className="input-wrapper">
          <input onChange={handleInputMessage} type="text" value={message} />
          <button onClick={handleEnterMessage}>送出</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MessageInput;
