import { requestChekLogin, requestLogout } from './request';

export default class UserDataManager {
  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;

    this.userData = {
      id: '',
      spaceId: 0,
      nickName: 'GUEST',
      x: 1,
      y: 1,
      skin: Math.floor(Math.random() * 13),
      face: Math.floor(Math.random() * 65),
      hair: Math.floor(Math.random() * 9),
      hair_color: Math.floor(Math.random() * 12),
      clothes: Math.floor(Math.random() * 7),
      clothes_color: Math.floor(Math.random() * 12),
      layer: 0,
    };

    this.isLogin = false;
    this.isChat = false;
  }

  static getInstance() {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  async checkLogin() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return false;

    const check = await requestChekLogin();
    if (check) {
      this.setUserData(check);
      this.isLogin = true;
      return true;
    } else {
      this.logOut();
      return false;
    }
  }

  isLoginState() {
    return this.isLogin;
  }

  async logOut() {
    const res = await requestLogout();
    this.isLogin = false;
    this.resetUserData();
  }

  getUserData() {
    return this.userData;
  }

  setStateChat(b) {
    this.isChat = b;
  }

  getStateChat() {
    return this.isChat;
  }

  setPosition(x, y) {
    this.userData.x = x;
    this.userData.y = y;
  }

  setLayer(layer) {
    this.userData.layer = layer;
  }

  resetUserData() {
    this.userData = {
      id: '',
      spaceId: 0,
      nickName: 'GUEST',
      x: 1,
      y: 1,
      skin: Math.floor(Math.random() * 13),
      face: Math.floor(Math.random() * 65),
      hair: Math.floor(Math.random() * 10),
      hair_color: Math.floor(Math.random() * 12),
      clothes: Math.floor(Math.random() * 7),
      clothes_color: Math.floor(Math.random() * 12),
      layer: '0',
    };
  }

  // setSocketId(id) {
  //   this.userData.id = id;
  // }

  setUserSkinData(data) {
    // this.userData.id = data.id;
    this.userData.skin = data.skin;
    this.userData.face = data.face;
    this.userData.hair = data.hair;
    this.userData.hair_color = data.hair_color;
    this.userData.clothes = data.clothes;
    this.userData.clothes_color = data.clothes_color;
  }

  setUserNickName(nickName) {
    this.userData.nickName = nickName;
  }

  enterSpace(socketId, spaceId) {
    console.log('enterSpace', socketId, spaceId);
    this.userData.id = socketId;
    this.userData.spaceId = spaceId;
    this.userData.x = 1;
    this.userData.y = 1;
    this.userData.layer = 0;
  }
}
