import React, { useState } from 'react';
import './styles/SpaceSidebar.css';
import { Link } from 'react-router-dom';

const SpaceSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);
  const [isShareActive, setIsShareActive] = useState(false);
  const [inButton, setInButton] = useState('home');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMicClick = () => {
    setIsMicActive(!isMicActive);
  };

  const handleCamClick = () => {
    setIsCamActive(!isCamActive);
  };

  const handleShareClick = () => {
    setIsShareActive(!isShareActive);
  };

  const handleChangeBadge = () => {
    setInButton('home');
  };

  const handleChangeChat = () => {
    setInButton('chat');
  };

  const handleChangeRoom = () => {
    setInButton('room');
  };

  const handleChangeOnline = () => {
    setInButton('online');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="buttonbox">
        <button className="sidebar-btn" onClick={handleMicClick}>
          <span className="material-symbols-outlined">
            {isMicActive ? 'mic' : 'mic_off'}
          </span>
        </button>
        <button className="sidebar-btn" onClick={handleCamClick}>
          <span className="material-symbols-outlined">
            {isCamActive ? 'videocam' : 'videocam_off'}
          </span>
        </button>
        <button className="sidebar-btn" onClick={handleShareClick}>
          <span className="material-symbols-outlined">
            {isShareActive ? 'desktop_windows' : 'desktop_access_disabled'}
          </span>
        </button>
        <button className="sidebar-btn" onClick={toggleSidebar}>
          <span className="material-symbols-outlined">
            {isOpen
              ? 'keyboard_double_arrow_right'
              : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>
      <div className="inbuttonbox">
        <button className="insidebar-btn" onClick={handleChangeBadge}>
          <span className="material-symbols-outlined">badge</span>
        </button>
        <button className="insidebar-btn" onClick={handleChangeChat}>
          <span className="material-symbols-outlined">chat</span>
        </button>
        <button className="insidebar-btn" onClick={handleChangeRoom}>
          <span className="material-symbols-outlined">forum</span>
        </button>
        <button className="insidebar-btn" onClick={handleChangeOnline}>
          <span className="material-symbols-outlined">group</span>
        </button>
      </div>

      <div className="sidebar-container">
        {inButton == 'home' && (
          <>
            <Link to="/" className="image-wrapper">
              <img src="/title.png" className="responsive-image" />
            </Link>

            <h3>스페이스이름</h3>
            <div className="btn">초대코드</div>
            <h3>닉네임</h3>
            <div className="btn">닉네임 변경</div>
            <div className="btn">캐릭터 꾸미기</div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpaceSidebar;
