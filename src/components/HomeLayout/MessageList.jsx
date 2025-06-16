import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const MessageList = ({
  groupChange,
  userName,
  refreshMessage,
  messages,
  setMessages,
  setReplyMessage,
  replyMessage,
}) => {
  //聊天室資訊

  //用來指定訊息收回
  const [messageId, setMessageId] = useState("");
  const [RecallModelShow, setRecallModelShow] = useState(false);
  const bottomRef = useRef(null);

  /*抓取單一群組聊天紀錄*/
  useEffect(() => {
    const getGroupMessage = async () => {
      try {
        const Group = await axios.get(
          `https://charroom-backend.onrender.com/api/messages/${groupChange}`
        );
        console.log(Group.data);
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
  const handleRecallModel = (msgId) => {
    setMessageId(msgId);

    setRecallModelShow((prev) => !prev);
  };
  /*關閉彈出視窗*/
  const handleCancelRecall = () => {
    setRecallModelShow((prev) => !prev);
  };
  //收回訊息
  const handleRecallMessage = async () => {
    try {
      await axios.post(
        "https://charroom-backend.onrender.com/api/messages/clear",
        JSON.stringify(messageId),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRecallModelShow((prev) => !prev);
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, content: null } : msg))
      );
      console.log("收回訊息成功");
    } catch (error) {
      console.log("收回訊息失敗", error);
    }
  };
  //回覆訊息
  const handleReplyMessage = async (msgId) => {
    try {
      const response = await axios.get(
        `https://charroom-backend.onrender.com/api/messages/single/${msgId}`
      );
      setReplyMessage(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("取得訊息失敗", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="message">
        {messages.map((msg) => {
          const isMe = userName === msg.userName;
          //找出被回覆的訊息
          const repliedMsg = msg.replyToMessageId
            ? messages.find((m) => m.id === msg.replyToMessageId)
            : null;
          return (
            <div
              key={msg.id}
              className={`message-container ${isMe ? "justify-end" : "justify-start"}`}
            >
              {msg.content == null ? (
                <div className="message-content">
                  <div className="message-body">{msg.userName}已收回訊息</div>
                </div>
              ) : (
                <div className="message-content">
                  {/*如果有回覆訊息顯示這攔*/}
                  {repliedMsg && (
                    <div className="reply-messsage-container">
                      <div className="reply-user">回覆訊息-{repliedMsg.userName}：</div>
                      <div className="reply-text">{repliedMsg.content}</div>
                    </div>
                  )}
                  <div className="message-body">
                    <div>{msg.userName}：</div>
                    <div>{msg.content}</div>
                  </div>

                  <div className="message-actions">
                    {isMe && <button onClick={() => handleRecallModel(msg.id)}>收回訊息</button>}
                    <button onClick={() => handleReplyMessage(msg.id)}>回覆</button>
                  </div>
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
      {replyMessage && (
        <div className="reply-container">
          <div>{replyMessage.userName}:</div>
          <div>{replyMessage.content}</div>
          <div></div>
          <button onClick={() => setReplyMessage(null)}>取消回覆</button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
