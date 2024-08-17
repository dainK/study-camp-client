import React, { useState, useEffect, useRef } from 'react';
import './styles/SpaceSidebar.css';
import { Link } from 'react-router-dom';
import SocketManager from '../util/SocketManager';
import UserDataManager from '../util/UserDataManager';
import ChangeSkinModal from './modal/ChangeSkinModal';
import ChangeNickModal from './modal/ChangeNickModal';
import CreateCodeModal from './modal/CreateCodeModal';

const SpaceSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);
  const [isShareActive, setIsShareActive] = useState(false);
  const [inButton, setInButton] = useState('home');

  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  useEffect(() => {
    SocketManager.getInstance().setMessagCallback(
      handleIncomingSpaceMessage,
      handleIncomingRoomMessage,
    );
    SocketManager.getInstance().setButtonCallback(
      setIsCamActive,
      setIsShareActive,
      setIsMicActive,
    );

    const handleScroll = () => {
      checkScrollBottom();
    };

    // 클릭 이벤트 리스너 추가
    document.addEventListener('click', handleClickOutside);

    // 채팅 컨테이너의 스크롤 이벤트 리스너 추가
    const chatContainers = document.querySelectorAll('.messages');
    chatContainers.forEach((container) =>
      container.addEventListener('scroll', handleScroll),
    );

    // 컴포넌트가 언마운트 될 때 소켓 연결 종료 및 이벤트 리스너 제거
    return () => {
      document.removeEventListener('click', handleClickOutside);
      chatContainers.forEach((container) =>
        container.removeEventListener('scroll', handleScroll),
      );
    };
  }, []); // 빈 배열로 설정하여 컴포넌트가 마운트될 때만 실행

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogo = () => {
    if (window.game) {
      window.game.destroy(true);
    }
    SocketManager.getInstance().disconnect();
  };

  const handleMicClick = () => {
    if (!isCamActive) {
      SocketManager.getInstance().startVoice();
    } else {
      SocketManager.getInstance().stopVoice();
    }
    setIsMicActive(!isMicActive);
  };

  const handleCamClick = () => {
    if (!isCamActive) {
      SocketManager.getInstance().startCamera();
    } else {
      SocketManager.getInstance().stopCamera();
    }
    setIsCamActive(!isCamActive);
  };

  const handleShareClick = () => {
    if (!isShareActive) {
      SocketManager.getInstance().startScreenShare();
    } else {
      SocketManager.getInstance().stopScreenShare();
    }
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

  const handleOpenSkinModal = () => {
    setIsSkinModalOpen(true);
  };

  const handleCloseSkinModal = () => {
    setIsSkinModalOpen(false);
  };

  const handleOpenNickModal = () => {
    setIsNickModalOpen(true);
  };

  const handleCloseNickModal = () => {
    setIsNickModalOpen(false);
  };

  const handleOpenCodeModal = () => {
    setIsCodeModalOpen(true);
  };

  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
  };
  // 상태 추가: 카드 목록
  const [cards, setCards] = useState([]);
  // 카드 추가 함수
  const addCard = (userId, id) => {
    setCards((prevCards) => [...prevCards, { id }]); // 빈 객체를 추가하여 카드 생성
  };

  // 카드 제거 함수
  const removeCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  // const { messages, addMessage } = useState([]);
  const [spaceMessages, setSpaceMessages] = useState([]);
  const [spaceMessageInput, setSpaceMessageInput] = useState('');
  const spaceMessageInputRef = useRef(null); // 입력 필드에 대한 참조 생성

  const [roomMessages, setRoomMessages] = useState([]);
  const [roomMessageInput, setRoomMessageInput] = useState('');
  const roomMessageInputRef = useRef(null); // 입력 필드에 대한 참조 생성

  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [spaceMessages, roomMessages, isAtBottom]); // spaceMessages, roomMessages, isAtBottom이 변경될 때마다 스크롤 조정

  const addListener = () => {
    UserDataManager.getInstance().setStateChat(true);
  };

  const removeListener = () => {
    UserDataManager.getInstance().setStateChat(false);
  };

  const handleClickOutside = (event) => {
    if (
      spaceMessageInputRef.current &&
      !spaceMessageInputRef.current.contains(event.target)
    ) {
      spaceMessageInputRef.current.blur(); // 입력 필드에서 포커스 제거
      removeListener();
    }
    if (
      roomMessageInputRef.current &&
      !roomMessageInputRef.current.contains(event.target)
    ) {
      roomMessageInputRef.current.blur(); // 입력 필드에서 포커스 제거
      removeListener();
    }
  };

  // Enter 키를 눌렀을 때 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter 키의 기본 동작 방지 (줄바꿈 방지)
      // console.log(inButton);
      if (inButton == 'chat') {
        handleSendSpaceMessage();
      }
      if (inButton == 'room') {
        handleSendRoomMessage();
      }
    }
  };

  const handleSendSpaceMessage = () => {
    if (spaceMessageInput.trim() !== '') {
      SocketManager.getInstance().sendSpaceMessage(spaceMessageInput);
      setSpaceMessageInput('');
      spaceMessageInputRef.current.focus(); // 입력 필드에 포커스 설정
    }
  };

  const handleIncomingSpaceMessage = (message) => {
    setSpaceMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendRoomMessage = () => {
    if (roomMessageInput.trim() !== '') {
      SocketManager.getInstance().sendRoomMessage(roomMessageInput);
      setRoomMessageInput('');
      roomMessageInputRef.current.focus(); // 입력 필드에 포커스 설정
    }
  };

  const handleIncomingRoomMessage = (message) => {
    console.log(message);
    setRoomMessages((prevMessages) => [...prevMessages, message]);
  };

  const checkScrollBottom = () => {
    const container = document.querySelector('.messages');
    if (container) {
      setIsAtBottom(
        container.scrollHeight - container.scrollTop === container.clientHeight,
      );
    }
  };

  const handleSpaceChatScroll = () => {
    checkScrollBottom();
  };

  const handleRoomChatScroll = () => {
    checkScrollBottom();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="webrtc-container">
        <div className="webrtc-card-container" id="webrtc-card-container">
          {/* {cards.map((card, index) => {
            const id = card.id;

            return (
              <div key={index} id={id} className="webrtc-card">
              </div>
            );
          })} */}
        </div>
      </div>
      <div className="buttonbox">
        <button className="sidebar-btn" onClick={handleCamClick}>
          <span className="material-symbols-outlined">
            {isCamActive ? 'videocam' : 'videocam_off'}
          </span>
        </button>
        <button className="sidebar-btn" onClick={handleMicClick}>
          <span className="material-symbols-outlined">
            {isMicActive ? 'mic' : 'mic_off'}
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
          <Link to="/" className="image-wrapper" onClick={handleLogo}>
            <img src="/title.png" className="responsive-image" />
          </Link>
          <h3>스페이스이름</h3>
          <div className="btn" onClick={handleOpenCodeModal}>
            초대코드
          </div>
          <h3>닉네임</h3>
          <div className="btn" onClick={handleOpenNickModal}>
            닉네임 변경
          </div>
          <div className="btn" onClick={handleOpenSkinModal}>
            캐릭터 꾸미기
          </div>
        </div>
      )}

      {inButton == 'chat' && (
        <div className="sidebar-container-chat">
          <h3>전체 채팅</h3>
          <div className="chatroom-container">
            <div className="messages" onScroll={handleSpaceChatScroll}>
              {spaceMessages.map((msg, index) => (
                <div key={index} className="message">
                  <strong style={{ color: '#226699' }}>{msg.nickName}</strong>
                  <br />
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={spaceMessageInput}
                onChange={(e) => setSpaceMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                ref={spaceMessageInputRef}
                onFocus={addListener}
                onBlur={removeListener}
              />
              <button onClick={handleSendSpaceMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      {inButton === 'room' && (
        <div className="sidebar-container-chat">
          <h3>구역 채팅</h3>
          <div className="chatroom-container">
            <div className="messages" onScroll={handleRoomChatScroll}>
              {roomMessages.map((msg, index) => (
                <div key={index} className="message">
                  <strong style={{ color: '#226699' }}>{msg.nickName}</strong>
                  <br />
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
              <input
                type="text"
                value={roomMessageInput}
                onChange={(e) => setRoomMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                ref={roomMessageInputRef}
                onFocus={addListener}
                onBlur={removeListener}
              />
              <button onClick={handleSendRoomMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      <CreateCodeModal
        show={isCodeModalOpen}
        handleClose={handleCloseCodeModal}
      />
      <ChangeNickModal
        isOpen={isNickModalOpen}
        onClose={handleCloseNickModal}
      />
      <ChangeSkinModal
        isOpen={isSkinModalOpen}
        onClose={handleCloseSkinModal}
      />
    </div>
  );
};

export default SpaceSidebar;
