import Phaser from 'phaser';
// resource
import Map from './Map.js';
import MapData from './defines/MapData.js';
import Player from './Player.js';
import OtherPlayer from './OtherPlayer.js';

import SocketManager from '../util/SocketManager.js';
import UserDataManager from '../util/UserDataManager.js';

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
    this.load.image(
      'tiles',
      `${process.env.VITE_CLIENT_URL}/assets/images/tiles.png`,
    );
    this.load.image(
      'table',
      `${process.env.VITE_CLIENT_URL}/assets/images/table.png`,
    );
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

    this.loadPlayerSkin(UserDataManager.getInstance().getUserData())
      .then(() => {
        const bgWidth = MapData.tileSize * MapData.column;
        const bgHeight = MapData.tileSize * MapData.row;
        this.player = new Player(
          this,
          UserDataManager.getInstance().getUserData(),
        );
        this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
        this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
        this.cameras.main.startFollow(this.player.getSprite(), false, 0.5, 0.5);
        // 플레이어에 물리 엔진 활성화
        this.physics.world.setBounds(0, 0, bgWidth, bgHeight);

        this.checkLayer();
        SocketManager.getInstance().joinLayer('0');
      })
      .catch((error) => console.error('Error loading player skin:', error));
  }

  loadPlayerSkin(data, callback) {
    return new Promise((resolve, reject) => {
      const skinIndex = data.skin + 1;
      const faceIndex = data.face + 1;
      const hairIndex = data.hair * 12 + data.hair_color + 1;
      const clothesIndex = data.clothes * 12 + data.clothes_color + 1;
      this.load.spritesheet(
        `skin-${skinIndex}`,
        `${process.env.VITE_CLIENT_URL}/assets/sprites/skin/-${skinIndex}.png`,
        {
          frameWidth: 48,
          frameHeight: 64,
        },
      );
      this.load.spritesheet(
        `face-${faceIndex}`,
        `${process.env.VITE_CLIENT_URL}/assets/sprites/face/-${faceIndex}.png`,
        {
          frameWidth: 48,
          frameHeight: 64,
        },
      );
      this.load.spritesheet(
        `hair-${hairIndex}`,
        `${process.env.VITE_CLIENT_URL}/assets/sprites/hair/-${hairIndex}.png`,
        {
          frameWidth: 48,
          frameHeight: 64,
        },
      );
      this.load.spritesheet(
        `clothes-${clothesIndex}`,
        `${process.env.VITE_CLIENT_URL}/assets/sprites/clothes/-${clothesIndex}.png`,
        {
          frameWidth: 48,
          frameHeight: 64,
        },
      );

      this.load.once('complete', () => resolve());

      // 로드 시작
      this.load.start();
    });
  }

  update() {
    // Update game state
  }

  eventscallback(namespace, data) {
    console.log('eventscallback' + '_' + namespace);
    switch (namespace) {
      case 'joinSpace':
        if (data.id !== SocketManager.getInstance().getID()) {
          this.loadPlayerSkin(data)
            .then(() => {
              if (!this.otherPlayers[data.id]) {
                this.otherPlayers[data.id] = new OtherPlayer(this, data);
              }
            })
            .catch((error) =>
              console.error('Error loading player skin:', error),
            );
        }
        break;

      case 'spaceUsers':
        const promises = data
          .filter(
            (playerData) =>
              playerData.id !== SocketManager.getInstance().getID(),
          )
          .map((playerData) => this.loadPlayerSkin(playerData));

        Promise.all(promises)
          .then(() => {
            data.forEach((playerData) => {
              if (playerData.id !== SocketManager.getInstance().getID()) {
                if (!this.otherPlayers[playerData.id]) {
                  this.otherPlayers[playerData.id] = new OtherPlayer(
                    this,
                    playerData,
                  );
                }
              }
            });
          })
          .catch((error) =>
            console.error('Error loading player skins:', error),
          );

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
