import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/ChangeSkinModal.css';
import UserDataManager from '../../util/UserDataManager';
import { requestChangeSkin } from '../../util/request';
import SocketManager from '../../util/SocketManager';

// 색상 배열
const colorArray = [
  'black',
  'gray',
  'orange',
  'yellow',
  'blue',
  'skyblue',
  'brown',
  'pink',
  'silver',
  'red',
  'green',
];

const ChangeSkinModal = ({ isOpen, onClose }) => {
  const [info, setInfo] = useState({
    hairIndex: UserDataManager.getInstance().getUserData().hair,
    hairColorIndex: UserDataManager.getInstance().getUserData().hair_color,
    clothesIndex: UserDataManager.getInstance().getUserData().clothes,
    clothesColorIndex:
      UserDataManager.getInstance().getUserData().clothes_color,
    skinIndex: UserDataManager.getInstance().getUserData().skin,
    faceIndex: UserDataManager.getInstance().getUserData().face,
  });
  const [activeTab, setActiveTab] = useState('hair');
  // const [selectedOption, setSelectedOption] = useState({
  //   hair: null,
  //   clothes: null,
  //   skin: null,
  //   face: null,
  // });
  const [selectedOption, setSelectedOption] = useState({
    hair: {
      index: UserDataManager.getInstance().getUserData().hair,
      colorIndex: UserDataManager.getInstance().getUserData().hair_color,
    },
    clothes: {
      index: UserDataManager.getInstance().getUserData().clothes,
      colorIndex: UserDataManager.getInstance().getUserData().clothes_color,
    },
    skin: { index: UserDataManager.getInstance().getUserData().skin },
    face: { index: UserDataManager.getInstance().getUserData().face },
  });

  useEffect(() => {
    if (isOpen) {
      //setActiveTab('hair'); // 모달이 열릴 때 기본 탭을 'hair'로 설정
      // 모달이 열릴 때 selectedOption을 info로 초기화
      setSelectedOption({
        hair: { index: info.hairIndex, colorIndex: info.hairColorIndex },
        clothes: {
          index: info.clothesIndex,
          colorIndex: info.clothesColorIndex,
        },
        skin: { index: info.skinIndex },
        face: { index: info.faceIndex },
      });
    }
  }, [isOpen, info]);

  const handleSave = async () => {
    const data = {
      hair: selectedOption['hair'].index,
      hair_color: selectedOption['hair'].colorIndex,
      clothes: selectedOption['clothes'].index,
      clothes_color: selectedOption['clothes'].colorIndex,
      skin: selectedOption['skin'].index,
      face: selectedOption['face'].index,
    };

    const isLogin = UserDataManager.getInstance().isLogin;
    if (isLogin) {
      const res = await requestChangeSkin(data);
      if (!res) {
        alert('유저 데이터 저장에 실패 하였습니다.');
      }
    }
    SocketManager.getInstance().ChangeSkin(data);
    onClose();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleColorClick = (index, type) => {
    setInfo({ ...info, [`${type}ColorIndex`]: index });
  };

  const handleOptionClick = (index, type) => {
    setInfo({ ...info, [`${type}Index`]: index });
    setSelectedOption({ ...selectedOption, [type]: index });
  };
  const getImageSrc = (index, type, colorIndex) => {
    const folderMapping = {
      hair: 'hair',
      clothes: 'clothes',
      face: 'face',
      skin: 'skin',
    };
    const folder = folderMapping[type];
    if (type === 'hair' || type === 'clothes') {
      const imageIndex = index * 12 + 1 + colorIndex;
      return `${process.env.VITE_CLIENT_URL}/assets/sprites/${folder}/-${imageIndex}.png`;
    } else {
      // For 'skin' and 'face'
      return `${process.env.VITE_CLIENT_URL}/assets/sprites/${folder}/-${
        index + 1
      }.png`;
    }
  };

  const renderOptions = (type, count) => {
    const colorIndex = info[`${type}ColorIndex`];
    const totalOptions =
      type === 'hair'
        ? 108
        : type === 'clothes'
        ? 84
        : type === 'face'
        ? 65
        : 13;

    // For 'hair' and 'clothes', filter options based on color
    const filteredOptions =
      type === 'hair' || type === 'clothes'
        ? [...Array(totalOptions).keys()].filter((i) => i % 12 == colorIndex)
        : [...Array(totalOptions).keys()]; // For 'skin' and 'face', no color filtering

    return filteredOptions.map((_, i) => (
      <div
        key={i}
        className="option-box"
        style={{
          width: '48px',
          height: '64px',
          overflow: 'hidden',
          position: 'relative',
          display: 'inline-block',
          margin: '0px',
          cursor: 'pointer',
          border:
            selectedOption[type]?.index === i &&
            selectedOption[type]?.colorIndex === colorIndex
              ? '2px solid blue'
              : 'none', // 선택된 옵션에 테두리 추가
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => handleOptionClick(i, type)}
      >
        <img
          src={getImageSrc(i, type, colorIndex)}
          // alt={`-${i + 1}`}
          style={{
            position: 'absolute',
            top: type === 'hair' ? 10 : type === 'clothes' ? -20 : 0,
            left: 0,
            objectFit: 'cover',
          }}
        />
      </div>
    ));
  };
  const renderColorSelectors = (type) => (
    <div className="color-selector" style={{ marginBottom: '20px' }}>
      {/* <h5>Select {type === 'hair' ? 'Hair Color' : 'Clothes Color'}</h5> */}
      {colorArray.map((color, index) => (
        <div
          key={index}
          className="color-option"
          style={{
            backgroundColor: color,
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'inline-block',
            margin: '4px',
            cursor: 'pointer',
          }}
          onClick={() => handleColorClick(index, type)}
        />
      ))}
    </div>
  );
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>캐릭터 꾸미기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="change-modal-tab-container mb-3  d-flex justify-content-between">
          <Button
            className="change-modal-tab"
            variant={activeTab === 'hair' ? 'primary' : 'outline-primary'}
            onClick={() => handleTabClick('hair')}
          >
            Hair
          </Button>
          <Button
            variant={activeTab === 'clothes' ? 'primary' : 'outline-primary'}
            onClick={() => handleTabClick('clothes')}
            className="change-modal-tab mx-2"
          >
            Clothes
          </Button>
          <Button
            className="change-modal-tab"
            variant={activeTab === 'skin' ? 'primary' : 'outline-primary'}
            onClick={() => handleTabClick('skin')}
          >
            Skin
          </Button>
          <Button
            variant={activeTab === 'face' ? 'primary' : 'outline-primary'}
            onClick={() => handleTabClick('face')}
            className="change-modal-tab mx-2"
          >
            Face
          </Button>
        </div>

        <div className="change-modal-content-container">
          {activeTab === 'hair' && (
            <>
              {renderColorSelectors('hair')}
              {renderOptions('hair', 108)}
            </>
          )}
          {activeTab === 'clothes' && (
            <>
              {renderColorSelectors('clothes')}
              {renderOptions('clothes', 84)}
            </>
          )}
          {activeTab === 'skin' && renderOptions('skin', 13)}
          {activeTab === 'face' && renderOptions('face', 65)}
        </div>

        <Button
          variant="primary"
          className="mt-3"
          style={{ width: '100%' }}
          onClick={handleSave}
        >
          적용하기
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeSkinModal;
