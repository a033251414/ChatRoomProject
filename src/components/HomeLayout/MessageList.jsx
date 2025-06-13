import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const MessageList = ({ refreshMessage, groupChange, userName }) => {
  //聊天室資訊
  const [messages, setMessages] = useState([]);
  //用來指定訊息收回
  const [messageId, setMessageId] = useState("");
  const [RecallModelShow, setRecalModelShow] = useState(false);
  const bottomRef = useRef(null);

  /*抓取群組聊天紀錄*/
  useEffect(() => {
    const GroupId = localStorage.getItem("GroupId");
    const getGroupMessage = async () => {
      try {
        const Group = await axios.get(`http://localhost:5182/api/messages/${GroupId}`);
        setMessages(Group.data);
      } catch (error) {
        console.log("抓取不到群組訊息", error);
      }
    };

    getGroupMessage();
  }, [refreshMessage, groupChange]);

  //訊息更新時自動滑到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  /*開起收回彈出視窗*/
  const handleRecallModel = (MsgId) => {
    setMessageId(MsgId);

    setRecalModelShow((prev) => !prev);
  };
  /*關閉彈出視窗*/
  const handleCancelRecall = () => {
    setRecalModelShow((prev) => !prev);
  };
  //收回訊息
  const handleRecallMessage = async () => {
    try {
      await axios.post("http://localhost:5182/api/messages/clear", JSON.stringify(messageId), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setRecalModelShow((prev) => !prev);
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? { ...msg, content: null } : msg)));
      console.log("收回訊息成功");
    } catch (error) {
      console.log("收回訊息失敗", error);
    }
  };

  return (
    <div className="message">
      {messages.map((msg) => {
        const isMe = userName === msg.userId;
        return (
          <div key={msg.id} className={`message-container ${isMe ? "justify-end" : "justify-start"}`}>
            {msg.content == null ? (
              <div className="message-content">
                <div className="message-body">{msg.userId}已收回訊息</div>
              </div>
            ) : (
              <div className="message-content">
                <div className="message-body">
                  <div>{msg.userId}：</div>
                  <div>{msg.content}</div>
                </div>
                <div className="message-actions">{isMe && <button onClick={() => handleRecallModel(msg.id)}>收回訊息</button>}</div>
              </div>
            )}
          </div>
        );
      })}
      {/*收回彈窗*/}
      {RecallModelShow && (
        <div className="recallmodel-container">
          <h1>確定收回</h1>
          <div>
            <button onClick={handleRecallMessage}>確認</button>
            <button onClick={handleCancelRecall}>取消</button>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
