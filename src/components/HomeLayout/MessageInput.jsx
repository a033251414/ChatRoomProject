import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../Api";
const MessageInput = ({
  userName,
  isLoggedIn,
  setRefreshMessage,
  groupChange,
  sendMessage,
  replyMessage,
  setReplyMessage,
}) => {
  //儲存當前要輸入的訊息
  const [message, setMessage] = useState("");

  const handleInputMessage = (e) => {
    setMessage(e.target.value);
  };

  //傳送訊息
  const handleEnterMessage = async () => {
    try {
      if (message.trim() === "") {
        console.log("請勿傳空白字元");
        return;
      }
      if (groupChange == "") {
        console.log("請選擇群組後發話");
      }
      if (message.length > 30) {
        alert("請入超過30字元");
      } else {
        const response = await axios.post(`${BASE_URL}/api/messages`, {
          groupId: groupChange,
          userName: userName,
          content: message,
          replyToMessageId: replyMessage ? replyMessage.id : null,
        });

        const messageData = response.data;
        await sendMessage(groupChange, messageData);
        setReplyMessage(null);
        setMessage("");
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
          <input
            onChange={handleInputMessage}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleEnterMessage();
              }
            }}
            type="text"
            value={message}
            placeholder="輸入訊息"
          />
          <button onClick={handleEnterMessage}>送出</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MessageInput;
