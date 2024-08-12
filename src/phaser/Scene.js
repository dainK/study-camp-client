import Phaser from 'phaser';
// resource
// import fontPng from './assets/font/font.png';
// import fontXml from './assets/font/font.xml';
import tiles from './assets/images/tiles.png';
import table from './assets/images/table.png';
// class
import Map from './Map.js';
import MapData from './defines/MapData.js';
import PlayerData from './defines/PlayerData.js';
import Player from './Player.js';
import OtherPlayer from './OtherPlayer.js';

import SocketManager from '../util/SocketManager.js';
import UserDataManager from '../util/UserDataManager.js';

const skinFiles = import.meta.glob('./assets/sprites/skin/*.png', {
  eager: false,
});
const hairFiles = import.meta.glob('./assets/sprites/hair/*.png', {
  eager: false,
});
const clothesFiles = import.meta.glob('./assets/sprites/clothes/*.png', {
  eager: false,
});
const faceFiles = import.meta.glob('./assets/sprites/face/*.png', {
  eager: false,
});

export default class Scene extends Phaser.Scene {
  constructor() {
    super('Scene');
  }

  async preload() {
    // FONT
    // this.load.bitmapFont('pixelFont', fontPng, fontXml);

    // Preload assets
    this.add.text(20, 20, 'Loading...', {
      fontSize: '30px',
      fill: '#ffffff',
      padding: {
        x: 0,
        y: 8,
      },
    });

    // IMAGES
    this.load.image('tiles', tiles);
    this.load.image('table', table);

    const scene = this;
    // 프로미스를 사용하여 각 파일 세트를 처리하는 함수
    async function loadSpritesheet(fileSet, prefix) {
      const promises = Object.values(fileSet).map((getFile, index) => {
        return getFile().then((module) => {
          scene.load.spritesheet(prefix + (index + 1), module.default, {
            frameWidth: 48,
            frameHeight: 64,
          });
        });
      });

      // 모든 프로미스가 완료될 때까지 기다림
      await Promise.all(promises);
    }

    // 각 세트를 순차적으로 로드
    async function loadAll() {
      await loadSpritesheet(skinFiles, 'skin-');
      await loadSpritesheet(hairFiles, 'hair-');
      await loadSpritesheet(clothesFiles, 'clothes-');
      await loadSpritesheet(faceFiles, 'face-');
    }

    // loadAll 함수를 호출하여 모든 스프라이트 시트 로딩 시작
    await loadAll();
    console.log('모든 스프라이트 시트 로딩 완료');
    // 이 시점에서 모든 자산 로딩이 완료되었습니다
    // 로딩이 완료된 후의 처리가 필요하면 여기에 작성합니다
  }

  create() {
    SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
    SocketManager.getInstance().joinSpace();

    this.otherPlayers = {};

    // Create game objects
    this.map = new Map(this);
    this.map.creatTileMap();

    const bgWidth = MapData.tileSize * MapData.column;
    const bgHeight = MapData.tileSize * MapData.row;

    // 마우스 휠 이벤트 감지
    let zoomSpeed = 0.03;
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      // const newZoom = this.cameras.main.zoom + deltaY * zoomSpeed;
      const standardDeltaY = 100; // 마우스 휠 한 칸당 표준 deltaY 값
      const zoomChange = (deltaY / standardDeltaY) * zoomSpeed; // 정규화된 deltaY 값을 사용한 줌 변화량 계산
      const newZoom = this.cameras.main.zoom + zoomChange;

      // 배경의 크기에 따라 줌 제한 설정
      const maxZoom = Math.max(
        (window.innerWidth - 20) / bgWidth,
        (window.innerHeight - 20) / bgHeight,
      );
      // 줌 값 범위 설정
      this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, maxZoom, 2);
    });

    this.player = new Player(this, { ...PlayerData, x: 1, y: 1 });
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.startFollow(this.player.getSprite(), false, 0.5, 0.5);
    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);

    this.checkLayer();
    SocketManager.getInstance().joinLayer('0');
  }

  update() {
    // Update game state
  }

  eventscallback(namespace, data) {
    console.log('eventscallback' + '_' + namespace);
    switch (namespace) {
      case 'joinSpace':
        if (data.id !== SocketManager.getInstance().getID()) {
          if (!this.otherPlayers[data.id]) {
            this.otherPlayers[data.id] = new OtherPlayer(this, data);
          }
        }
        break;

      case 'spaceUsers':
        data.forEach((playerdata) => {
          if (playerdata.id !== SocketManager.getInstance().getID()) {
            if (!this.otherPlayers[playerdata.id]) {
              this.otherPlayers[playerdata.id] = new OtherPlayer(
                this,
                playerdata,
              );
            }
          }
        });

        break;

      case 'leaveSpace':
        if (this.otherPlayers[data.id]) {
          const leavePlayer = this.otherPlayers[data.id];
          leavePlayer.destroy();
          this.otherPlayers[data.id] = null;
        }
        break;

      case 'movePlayer':
        if (this.otherPlayers[data.id]) {
          const leavePlayer = this.otherPlayers[data.id];
          leavePlayer.moveOtherPlayer(data.x, data.y);
        }
        break;
    }
  }

  checkLayer() {
    const prevLayer = UserDataManager.getInstance()
      .getUserData()
      .layer.toString();
    let nextLayer = '0';
    this.map.getLayers().forEach((layer) => {
      layer.setAlpha(0.3);
      if (
        Phaser.Geom.Rectangle.Contains(
          layer.getBounds(),
          this.player.getSprite().x,
          this.player.getSprite().y,
        )
      ) {
        layer.setAlpha(1);
        if (layer.name.toString() != '0') {
          nextLayer = layer.name.toString();
        }
      }
    });
    // console.log('joinLayer', prevLayer, nextLayer);
    if (prevLayer != nextLayer) {
      SocketManager.getInstance().joinLayer(nextLayer);
    }
  }
}
