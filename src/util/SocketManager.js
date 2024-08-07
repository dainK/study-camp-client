import io from 'socket.io-client';
import UserDataManager from './UserDataManager';

export default class SocketManager {
  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;

    this.callbacks = [];
    // this.connect();
    // this.userData = UserDataManager.getInstance().getUserData();
  }

  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  getID() {
    return this.socket.id.toString();
  }
  subscribe(callback) {
    this.callbacks.push(callback);
  }

  removeCallbacks() {
    this.callbacks.length = 0;
  }

  publish(namespace, data) {
    this.callbacks.forEach((callback) => callback(namespace, data));
  }

  async connect(spaceId) {
    this.socket = await io(process.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', async (socket) => {
      UserDataManager.getInstance().enterSpace(this.socket.id, spaceId);
      console.log('connect');
    });

    this.socket.on('disconnect', async (socket) => {
      console.log('disconnect');
      // this.publish('disconnect', {id:this.socketID});
    });

    this.socket.on('joinSpace', async (spaceUsers) => {
      this.publish('joinSpace', spaceUsers);
    });

    this.socket.on('leaveSpace', (data) => {
      console.log('leaveSpace', data);
      this.publish('leaveSpace', data);
    });

    this.socket.on('joinLayer', (data) => {
      console.log('joinLayer', data);
      this.publish('joinLayer', data);
    });

    this.socket.on('leaveLayer', (data) => {
      console.log('leaveLayer', data);
      this.publish('leaveLayer', data);
    });

    this.socket.on('sendSpaceMessage', (data) => {
      console.log('sendSpaceMessage', data);
      this.publish('sendSpaceMessage', data);
    });

    this.socket.on('sendLayerMessage', (data) => {
      console.log('sendLayerMessage', data);
      this.publish('sendLayerMessage', data);
    });

    this.socket.on('movePlayer', (data) => {
      console.log('movePlayer', data);
      this.publish('movePlayer', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSpace() {
    if (this.socket) {
      this.socket.emit(
        'joinSpace',
        UserDataManager.getInstance().getUserData(),
        (response) => {
          if (response.status === 'success') {
            console.log(response.message);
          } else {
            console.error(response.message);
          }
        },
      );
    }
  }

  movePlayer(x, y) {
    UserDataManager.getInstance().setPosition(x, y);
    if (this.socket) {
      this.socket.emit(
        'movePlayer',
        UserDataManager.getInstance().getUserData(),
        (response) => {
          if (response.status === 'success') {
            console.log(response.message);
          } else {
            console.error(response.message);
          }
        },
      );
    }
  }

  leaveSpace() {
    this.socket.emit('leaveSpace', UserDataManager.getInstance().getUserData());
  }

  joinLayer(layer) {
    UserDataManager.getInstance().setLayer(layer);
    this.socket.emit('joinLayer', UserDataManager.getInstance().getUserData());
  }

  // leaveLayer(layer) {
  //   this.userData.layer = layer;
  //   this.socket.emit('leaveLayer', this.userData);
  // }
}
