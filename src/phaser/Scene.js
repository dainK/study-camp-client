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

  preload() {
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

    // // Player Skin
    // let skinIndex = 0;
    // for (const path in skinFiles) {
    //   skinFiles[path]().then((module) => {
    //     skinIndex++;
    //     // const fileName = module.default.split('/').pop();
    //     // const name = fileName.split('.')[0];
    //       this.load.spritesheet('skin-' + skinIndex, module.default, {
    //         frameWidth: 48,
    //         frameHeight: 64,
    //       });
    //   });
    // }

    // // Player Hair
    // let hairIndex = 0;
    // for (const path in hairFiles) {
    //   hairFiles[path]().then((module) => {
    //     hairIndex++
    //     // const fileName = module.default.split('/').pop();
    //     // const name = fileName.split('.')[0];
    //       this.load.spritesheet('hair-' + hairIndex, module.default, {
    //         frameWidth: 48,
    //         frameHeight: 64,
    //       });
    //   });
    // }

    // // Player Clothes
    // let clothesIndex = 0;
    // for (const path in clothesFiles) {
    //   clothesFiles[path]().then((module) => {
    //     clothesIndex++;
    //     // const fileName = module.default.split('/').pop();
    //     // const name = fileName.split('.')[0];
    //       this.load.spritesheet('clothes-' + clothesIndex, module.default, {
    //         frameWidth: 48,
    //         frameHeight: 64,
    //       });
    //   });
    // }

    // // Player Face
    // let faceIndex = 0;
    // for (const path in faceFiles) {
    //   faceFiles[path]().then((module) => {
    //     faceIndex++;
    //     // const fileName = module.default.split('/').pop();
    //     // const name = fileName.split('.')[0];
    //       this.load.spritesheet('face-' + faceIndex, module.default, {
    //         frameWidth: 48,
    //         frameHeight: 64,
    //       });
    //   });
    // }

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
    loadAll.call(this).then(() => {
      console.log('모든 스프라이트 시트 로딩 완료');
      // 여기에 모든 로딩이 완료된 후의 로직을 추가할 수 있습니다.
    });
  }

  create() {
    // Create game objects
    this.map = new Map(this);
    this.map.creatTileMap();

    const bgWidth = MapData.tileSize * MapData.column;
    const bgHeight = MapData.tileSize * MapData.row;

    this.player = new Player(this, { ...PlayerData, x: 1, y: 1 });
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    // this.cameras.main.startFollow(this.player.getSprite(), false, 0.5, 0.5);
    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
  }

  update() {
    // Update game state
  }
}
