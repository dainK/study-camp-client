import React, { useState, useEffect, useRef } from 'react';
import './styles/SpaceSidebar.css';
import { Link } from 'react-router-dom';
import SocketManager from '../util/SocketManager';

const SpaceSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);
  const [isShareActive, setIsShareActive] = useState(false);
  const [inButton, setInButton] = useState('home');

  useEffect(() => {
    SocketManager.getInstance().setSpaceMessagCallback(handleIncomingMessage);

    // 컴포넌트가 언마운트 될 때 소켓 연결 종료
    return () => {};
  }, []);

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

  // Enter 키를 눌렀을 때 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter 키의 기본 동작 방지 (줄바꿈 방지)
      handleSend();
    }
  };
  // const { messages, addMessage } = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null); // 입력 필드에 대한 참조 생성

  const handleSend = () => {
    if (input.trim() !== '') {
      SocketManager.getInstance().sendSpaceMessage(input);
      // setMessages([...messages, input]);
      setInput('');
      inputRef.current.focus(); // 입력 필드에 포커스 설정
    }
  };
  // const handleSend = () => {
  //   if (input.trim() !== '') {
  //     SocketManager.getInstance().sendSpaceMessage(input);
  //     setInput('');
  //   }
  // };

  const handleIncomingMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    // setMessages([...messages, message]);
    // setInput('');
    // addMessage(message);
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

      {inButton == 'home' && (
        <div className="sidebar-container">
          <Link to="/" className="image-wrapper">
            <img src="/title.png" className="responsive-image" />
          </Link>

          <h3>스페이스이름</h3>
          <div className="btn">초대코드</div>
          <h3>닉네임</h3>
          <div className="btn">닉네임 변경</div>
          <div className="btn">캐릭터 꾸미기</div>
        </div>
      )}

      {inButton == 'chat' && (
        <div className="sidebar-container-chat">
          <h3>전체 채팅</h3>
          <div className="chatroom-container">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <strong style={{ color: '#226699' }}>{msg.nickName}</strong>
                  <br />
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown} // Enter 키 이벤트 핸들러 추가
                placeholder="Type a message..."
                ref={inputRef} // 입력 필드에 대한 참조 설정
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceSidebar;
