import axios from "axios";
import React, { useState } from "react";
const MessageInput = ({ setRefreshMessage, userName, isLoggedIn }) => {
  const [message, setMessage] = useState("");
  const GroupId = localStorage.getItem("GroupId");
  const handleInputMessage = (e) => {
    setMessage(e.target.value);
  };

  //傳送訊息
  const hanleEnterMessage = async () => {
    try {
      if (message == "") {
        console.log("請勿傳空白字元");
      } else {
        console.log(userName);
        setMessage("");
        await axios.post("http://localhost:5182/api/messages", { groupId: GroupId, userId: userName, content: message });
        setRefreshMessage((prev) => !prev);

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
          <button onClick={hanleEnterMessage}>送出</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MessageInput;
