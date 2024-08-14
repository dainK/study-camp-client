import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import Scene from '../phaser/Scene.js';
import SpaceSidebar from './SpaceSidebar.jsx';
import SocketManager from '../util/SocketManager.js';
import { requestCheckSpace, requestSignupSpace } from '../util/request.js';
import UserDataManager from '../util/UserDataManager.js';

const Space = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const setupGame = async () => {
      if (!id) {
        console.log('ID가 유효하지 않음:', id);
        navigate('/');
      } else {
        const spaceId = await requestCheckSpace(id);
        if (!!spaceId) {
          console.log('유효한 ID:', id);
          window.addEventListener('resize', handleWindowResize);
          // 로그인 체크
          const isLogin = await UserDataManager.getInstance().checkLogin();
          if (isLogin) {
            const userId = UserDataManager.getInstance().getUserData().id;
            // 멤버 가입
            await requestSignupSpace(userId, spaceId);
          }
          initGame();
          await SocketManager.getInstance().connect(spaceId);
        } else {
          console.log('ID가 유효하지 않음:', id);
          navigate('/');
        }
      }
    };

    setupGame();

    return () => {
      console.log('클린업');
      window.removeEventListener('resize', handleWindowResize);
      if (window.game) {
        window.game.destroy(true);
      }
      SocketManager.getInstance().disconnect();
    };
  }, [id, navigate]);

  const handleWindowResize = () => {
    if (window.game) {
      window.game.scale.resize(window.innerWidth, window.innerHeight);
    }
  };

  const initGame = () => {
    const config = {
      type: Phaser.CANVAS,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      scene: [Scene],
      dom: {
        createContainer: true,
      },
      physics: {
        default: 'arcade',
      },
    };
    window.game = new Phaser.Game(config);
    document.body.style.overflow = 'hidden'; // 스크롤 숨기기
  };

  return (
    <>
      <SpaceSidebar />
      {/* <Title /> */}
      <div className="phaser-game" />
    </>
  );
};

export default Space;
