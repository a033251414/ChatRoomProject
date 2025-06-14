import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Grouplist = ({ setGroupChange, setGroupTitle, isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);
  const [createGroupName, setCreateGroupName] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleShowModal = () => {
    setShowModal((prev) => !prev);
  };

  //接收創建聊天室名稱
  const handleChangeGroupName = (e) => {
    const GroupName = e.target.value;
    setCreateGroupName(GroupName);
  };

  //創建聊天室
  const handleCreateGroup = async () => {
    if (!createGroupName.trim()) {
      alert("群組名稱不能為空");
      return;
    }
    try {
      await axios.post("http://localhost:5182/api/group", {
        groupName: createGroupName,
      });

      setCreateGroupName("");
      setShowModal(false);
      setRefreshFlag((prev) => !prev);
      alert("群組創建成功");
    } catch (error) {
      console.log(error);
      alert("創建群組失敗");
    }
  };

  //抓取群組資料
  useEffect(() => {
    const GroupListGet = async () => {
      try {
        const GroupList = await axios.get("https://charroom-backend.onrender.com/api/group");

        setGroupList(GroupList.data);
      } catch (error) {
        console.error("抓取GroupList失敗", error);
      }
    };
    GroupListGet();
  }, [refreshFlag]);

  //變換聊天室
  const handleClickGroup = (groupId, groupName) => {
    localStorage.setItem("GroupId", groupId);
    localStorage.setItem("GroupName", groupName);
    setGroupChange(groupId);
    setGroupTitle(groupName);
  };

  return (
    <div className="chat-list-container">
      {isLoggedIn ? (
        <div className="chat-list">
          <div>
            <button onClick={() => handleShowModal()}>創建群組</button>
          </div>
          {groupList.map((group) => (
            <div
              onClick={() => handleClickGroup(group.id, group.groupName)}
              className="chat-list-item"
              key={group.id}
            >
              <h1>{group.groupName}</h1>
            </div>
          ))}
        </div>
      ) : (
        <div className="guestlayout-container">
          請先<Link to="/login">登入</Link>
        </div>
      )}

      {/*創建群組彈窗*/}
      {showModal && (
        <div>
          <div className="modal-container">
            <label htmlFor="groupName">請輸入群組名稱</label>
            <input
              onChange={handleChangeGroupName}
              type="text"
              id="groupName"
              placeholder="輸入群組名稱"
              value={createGroupName}
            />
            <div className="modal-button-container">
              <div></div>
              <button onClick={() => handleShowModal()}>關閉</button>
              <button onClick={handleCreateGroup}>創建群組</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grouplist;
