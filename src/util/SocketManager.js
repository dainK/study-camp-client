import io from 'socket.io-client';

export default class SocketManager {
  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;

    this.callbacks = [];
    // this.connect();
    this.userData = {
      id: '',
      spaceId: 0,
      nickName: '닉네임',
      x: 1,
      y: 1,
      skin: 0,
      face: 0,
      hair: 0,
      hair_color: 0,
      clothes: 0,
      clothes_color: 0,
      layer: 0,
    };
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

  async connect() {
    this.socket = await io(process.env.VITE_SERVER_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', async (socket) => {
      this.userData.id = this.socket.id;
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
      this.socket.emit('joinSpace', this.userData, (response) => {
        if (response.status === 'success') {
          console.log(response.message);
        } else {
          console.error(response.message);
        }
      });
    }
  }

  movePlayer(x, y) {
    this.userData.x = x;
    this.userData.y = y;
    if (this.socket) {
      this.socket.emit('movePlayer', this.userData, (response) => {
        if (response.status === 'success') {
          console.log(response.message);
        } else {
          console.error(response.message);
        }
      });
    }
  }

  leaveSpace() {
    this.socket.emit('leaveSpace', this.userData);
  }

  joinLayer(layer) {
    this.userData.layer = layer;
    this.socket.emit('joinLayer', this.userData);
  }

  // leaveLayer(layer) {
  //   this.userData.layer = layer;
  //   this.socket.emit('leaveLayer', this.userData);
  // }
}
