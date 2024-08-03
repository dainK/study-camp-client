import React, { Component } from 'react';
import Phaser from 'phaser';

import Scene from '../phaser/Scene.js';

class Space extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.initGame();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    if (this.game) {
      this.game.destroy(true);
    }
  }

  handleWindowResize = () => {
    if (this.game) {
      this.game.scale.resize(window.innerWidth, window.innerHeight);
    }
  };

  initGame() {
    const config = {
      type: Phaser.AUTO,
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
    this.game = new Phaser.Game(config);
    document.body.style.overflow = 'hidden'; // 스크롤을 없애기 위한 스타일 추가
  }

  render() {
    return <div id="phaser-game" />;
  }
}

export default Space;
