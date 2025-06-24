import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Api";
const MessageSearch = ({ groupChange, isLoggedIn }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };
  //傳入當前群組ID及搜尋訊息、回傳該群組查詢到的歷史訊息
  const handleSearchClick = async () => {
    const response = await axios.post(`${BASE_URL}/api/messages/searchingroup`, {
      groupId: groupChange,
      keyword: searchText,
    });
    setSearchResults(response.data);
  };

  return (
    <div className="search-bar-container">
      {isLoggedIn ? (
        <div className="message-search-container">
          <div className="search-input-container">
            <input onChange={handleSearchText} value={searchText} type="text" />
            <button onClick={handleSearchClick}>🔍︎</button>
          </div>
          <section className="search-results-container">
            {searchResults.map((message) => {
              return (
                <div key={message.id}>
                  {message.userName}: {message.content}
                </div>
              );
            })}
          </section>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MessageSearch;
