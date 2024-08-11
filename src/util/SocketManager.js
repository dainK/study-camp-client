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

    this.spaceMessageCallback = null;
    this.roomMessageCallback = null;

    this.setCameraFunc = null;
    this.setScreenFunc = null;
    this.setVoiceFunc = null;

    this.mediaStream = null;
    this.screenStream = null;
    // this.audioStream = null;
    // this.layerPeerIds = [];
    this.peerConnections = {};
    this.servers = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    };
    this.myCard = null;
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

    UserDataManager.getInstance().enterSpace(this.socket.id, spaceId);

    this.myCard = document.getElementById('card_my');
    if (!this.myCard) {
      this.myCard = document.createElement('video');
      this.myCard.id = `card_my`;
      this.myCard.autoplay = true;
      this.myCard.width = 160;
      this.myCard.height = 120;
      this.myCard.style.backgroundColor = 'white'; // 원하는 색상으로 변경 가능
      this.myCard.style.margin = '4px'; // 원하는 색상으로 변경 가능
      document.getElementById('webrtc-card-container').appendChild(this.myCard);
    }

    try {
      if (!this.mediaStream) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.mediaStream
          .getVideoTracks()
          .forEach((track) => (track.enabled = false));

        this.myCard.srcObject = this.mediaStream;
      }
    } catch (error) {
      console.error('미디어 장치에 접근할 수 없습니다:', error);
      // alert('카메라 또는 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    }

    try {
      if (!this.audioStream) {
        this.audioStream = await await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.audioStream
          .getAudioTracks()
          .forEach((track) => (track.enabled = false));
      }
    } catch (error) {
      // console.error('미디어 장치에 접근할 수 없습니다:', error);
      // alert('카메라 또는 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    }

    // try {
    //   if (!this.screenStream) {
    //     this.screenStream = await navigator.mediaDevices.getUserMedia({
    //       audio: true,
    //       // video: true,
    //     });
    //     this.screenStream.isScreen = true;
    //     this.screenStream
    //       .getVideoTracks()
    //       .forEach((track) => (track.enabled = false));
    //   }
    // } catch (error) {
    //   // console.error('미디어 장치에 접근할 수 없습니다:', error);
    //   // alert('카메라 또는 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    // }

    this.socket.on('connect', async (socket) => {
      console.log('connect');
    });

    this.socket.on('disconnect', async (socket) => {
      console.log('disconnect');
      // this.publish('disconnect', {id:this.socketID});
    });

    this.socket.on('joinSpace', async (data) => {
      this.publish('joinSpace', data);
    });

    this.socket.on('spaceUsers', async (spaceUsers) => {
      this.publish('spaceUsers', spaceUsers);

      spaceUsers.forEach((data) => {
        if (data.id !== this.socket.id && !this.peerConnections[data.id]) {
          console.log(`Initiating peer connection with user: ${data.id}`);
          this.createOffer(data.id);
        }
      });
    });

    this.socket.on('leaveSpace', (data) => {
      console.log('leaveSpace', data);

      let video = document.getElementById(`card_${data.id}_camera`);
      if (video) {
        video.style.display = 'none';
        video.remove();
      }
      // this.stopStreams();
      this.publish('leaveSpace', data);
    });

    this.socket.on('joinLayer', async (data) => {
      console.log('joinLayer', data);
      let video = document.getElementById(`card_${data.id}_camera`);
      if (video) {
        video.style.display = 'block';
      }
      this.publish('joinLayer', data);
    });

    this.socket.on('layerUsers', async (layerUsers) => {
      console.log('Layer users', layerUsers);
      // this.cleanUpConnections(); // 기존 연결 정리
      // await this.handleNewLayerUsers(layerUsers);
      layerUsers.forEach((data) => {
        let video = document.getElementById(`card_${data.id}_camera`);
        if (video) {
          video.style.display = 'block';
        }
      });

      this.publish('layerUsers', layerUsers);
    });

    this.socket.on('leaveLayer', (data) => {
      if (data.id != this.socket.id) {
        let video = document.getElementById(`card_${data.id}_camera`);
        if (video) {
          video.style.display = 'none';
        }
      }

      console.log('Left layer', data);
      this.publish('leaveLayer', data);
    });

    // this.socket.on('sendSpaceMessage', (data) => {
    // });

    this.socket.on('spaceMessage', (data) => {
      console.log('spaceMessage', data);
      this.spaceMessageCallback(data);
    });

    // this.socket.on('sendLayerMessage', (data) => {
    // });

    this.socket.on('layerMessage', (data) => {
      console.log('layerMessage', data);
      this.roomMessageCallback(data);
    });

    this.socket.on('movePlayer', (data) => {
      // console.log('movePlayer', data);
      this.publish('movePlayer', data);
    });

    this.socket.on('offer', async (data) => {
      // const { offer, socketId } = data;
      // console.log('Received offer from', socketId);
      // await this.handleOffer(offer, socketId);
      console.log(`Received offer from user: ${data.sender}`);
      if (data.sender !== this.socket.id) {
        if (!this.peerConnections[data.sender]) {
          const peerConnection = this.createPeerConnection(data.sender);
          try {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.sdp),
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            this.socket.emit('answer', {
              sdp: peerConnection.localDescription,
              target: data.sender,
            });
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        }
      }
    });

    this.socket.on('answer', async (data) => {
      // const { answer, socketId } = data;
      // console.log('Received answer from', socketId);
      // await this.handleAnswer(answer, socketId);
      console.log(`Received answer from user: ${data.sender}`);
      if (data.sender !== this.socket.id && this.peerConnections[data.sender]) {
        try {
          await this.peerConnections[data.sender].setRemoteDescription(
            new RTCSessionDescription(data.sdp),
          );
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    });

    this.socket.on('candidate', async (data) => {
      // const { candidate, socketId } = data;
      // console.log('Received candidate from', socketId);
      // await this.handleCandidate(candidate, socketId);
      console.log(`Received ICE candidate from user: ${data.sender}`);
      if (data.sender !== this.socket.id && this.peerConnections[data.sender]) {
        try {
          await this.peerConnections[data.sender].addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    this.socket.on('cameraon', async (id) => {
      if (id != this.socket.id) {
        let card = document.getElementById(`card_${id}`);
        if (card) {
          card.style.display = 'none';
        }
        const video = document.getElementById(`card_${id}_camera`);
        if (video) {
          video.style.display = 'block';
        }
      }
    });
    this.socket.on('cameraoff', async (id) => {
      let card = document.getElementById(`card_${id}`);
      if (card) {
        card.style.display = 'block';
      }
      const video = document.getElementById(`card_${id}_camera`);
      if (video) {
        video.style.display = 'none';
      }
    });
    this.socket.on('screenon', async (id) => {
      if (id != this.socket.id) {
        const screen = document.getElementById(`card_${id}_screen`);
        if (screen) {
          screen.style.display = 'block';
        }
      }
    });
    this.socket.on('screenoff', async (id) => {
      const screen = document.getElementById(`card_${id}_screen`);
      if (screen) {
        screen.style.display = 'none';
      }
    });
    this.socket.on('voiceon', async (id) => {
      if (id != this.socket.id) {
      }
    });
    this.socket.on('voiceoff', async (id) => {});
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  cleanUpConnections() {
    Object.keys(this.peerConnections).forEach((socketId) => {
      this.peerConnections[socketId].close();
      delete this.peerConnections[socketId];
      console.log('Cleaned up peer connection for', socketId);
    });
  }

  stopStreams() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }
    this.cleanUpConnections();
  }

  async createOffer(targetUserId) {
    console.log(`Creating offer for user: ${targetUserId}`);
    const peerConnection = this.createPeerConnection(targetUserId);
    try {
      const offer = await peerConnection.createOffer();
      console.log(`Created offer for user: ${targetUserId}`);
      await peerConnection.setLocalDescription(offer);
      console.log(`Set local description for user: ${targetUserId}`);
      this.socket.emit('offer', {
        sdp: peerConnection.localDescription,
        target: targetUserId,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  createPeerConnection(userId) {
    console.log(`Creating peer connection for user: ${userId}`);
    const peerConnection = new RTCPeerConnection();
    this.peerConnections[userId] = peerConnection;
    // peerConnection.addTrack(track, null);
    // let video = document.getElementById(`card_${userId}_camera`);
    // if (!video) {
    //   video = document.createElement('video');
    //   video.id = `card_${userId}_camera`;
    //   video.autoplay = true;
    //   video.height = 117;
    //   video.width = 208;
    //   video.style.backgroundColor = 'black'; // 원하는 색상으로 변경 가능
    //   video.style.margin = '4px'; // 원하는 색상으로 변경 가능
    //   document.getElementById('webrtc-card-container').appendChild(video);
    // }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.mediaStream);
      });
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, screenStream);
      });
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.audioStream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`Sending ICE candidate to user: ${userId}`);
        this.socket.emit('candidate', {
          candidate: event.candidate,
          target: userId,
        });
      }
    };
    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      const streamId = stream.id;
      console.log('Track event received', userId);
      // console.log('Track event received', stream);
      // if (stream.isCamera) {
      //   console.log('camera');
      // }
      // if (stream.isScreen) {
      //   console.log('screen');
      // }
      // if (stream.isAudio) {
      //   console.log('audio');
      // }

      // event.streams.forEach((stream) => {
      //   stream.getTracks().forEach((track) => {
      //     stream.addTrack(track);
      //   });
      // });
      let card = document.getElementById(`card_${userId}`);
      if (!card) {
        card = document.createElement('img');
        card.id = `card_${userId}`;
        card.autoplay = true;
        card.width = 160;
        card.height = 120;
        document.getElementById('webrtc-card-container').appendChild(card);
        // card.srcObject = stream;
        card.style.display = 'block';
        card.style.backgroundColor = 'black';
      }

      let video = document.getElementById(`card_${userId}_camera`);
      if (!video) {
        video = document.createElement('video');
        video.id = `card_${userId}_camera`;
        video.autoplay = true;
        video.width = 160;
        video.height = 120;
        document.getElementById('webrtc-card-container').appendChild(video);
        video.srcObject = stream;
        video.style.display = 'none';
      } else {
        let screen = document.createElement('video');
        screen.id = `card_${userId}_screen`;
        screen.autoplay = true;
        video.width = 160;
        video.height = 120;
        document.getElementById('webrtc-card-container').appendChild(video);
        screen.srcObject = stream;
      }
    };

    return peerConnection;
  }

  setMessagCallback(spaceMessageCallback, roomMessageCallback) {
    this.spaceMessageCallback = spaceMessageCallback;
    this.roomMessageCallback = roomMessageCallback;
  }

  setMessagCallback(setCameraFunc, setScreenFunc, setVoiceFunc) {
    this.setCameraFunc = setCameraFunc;
    this.setScreenFunc = setScreenFunc;
    this.setVoiceFunc = setVoiceFunc;
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
    const container = document.getElementById('webrtc-card-container');
    // 컨테이너의 모든 자식 요소를 가져오기
    const children = container.children;
    // 각 자식 요소의 display 속성을 'none'으로 설정
    Array.from(children).forEach((child) => {
      child.style.display = 'none';
    });

    this.myCard.style.display = 'block';

    UserDataManager.getInstance().setLayer(layer);
    this.socket.emit('joinLayer', UserDataManager.getInstance().getUserData());
  }

  sendSpaceMessage(message) {
    if (this.socket) {
      this.socket.emit(
        'sendSpaceMessage',
        { ...UserDataManager.getInstance().getUserData(), message },
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

  sendRoomMessage(message) {
    if (this.socket) {
      this.socket.emit(
        'sendLayerMessage',
        { ...UserDataManager.getInstance().getUserData(), message },
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

  async startCamera() {
    try {
      if (!this.mediaStream) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.myCard.srcObject = this.mediaStream;
      }
      this.mediaStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = true));

      this.socket.emit('webRTCStatus', { type: 'camera', status: 'on' });
      // return true;
    } catch (err) {
      console.error('startCamera', err);
      // return false;
      this.setCameraFunc(false);
      this.stopCamera();
    }
  }

  async stopCamera() {
    try {
      this.mediaStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = false));
      this.socket.emit('webRTCStatus', { type: 'camera', status: 'off' });
    } catch (err) {
      console.log('stopCamera', err);
    }
  }

  async startScreenShare() {
    try {
      if (!this.screenStream) {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        this.screenStream.getVideoTracks()[0].onended = () => {
          // 화면 공유가 중지된 경우의 처리 로직
          this.setScreenFunc(false);
          this.stopScreenshare();
        };
      }

      this.screenStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = true));

      Object.keys(this.peerConnections).forEach((peerId) => {
        // for (const peerId in peers) {

        this.screenStream.getTracks().forEach((track) => {
          this.peerConnections[peerId].addTrack(track, this.screenStream);
        });
      });

      this.socket.emit('webRTCStatus', { type: 'screen', status: 'on' });
      // return true;
    } catch (err) {
      console.log('startScreenShare', err);
      // return false;
      // 화면 공유가 취소되었을 때의 처리 로직
      this.setScreenFunc(false);
      this.stopScreenshare();
    }
  }

  async stopScreenshare() {
    try {
      // this.mediaStream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      // });
      if (this.screenStream) {
        this.screenStream
          .getVideoTracks()
          .forEach((track) => (track.enabled = false));

        // Object.keys(this.peerConnections).forEach((peerId) => {
        //   // for (const peerId in peers) {
        //   this.mediaStream.getTracks().forEach((track) => {
        //     // peers[peerId].addTrack(track, this.mediaStream);
        //     this.peerConnections[peerId].getSenders().forEach((sender) => {
        //       if (sender.track === track) {
        //         this.peerConnections[peerId].removeTrack(sender);
        //       }
        //     });
        //   });
        // });
      }
      this.socket.emit('webRTCStatus', { type: 'screen', status: 'off' });
    } catch (err) {
      console.log('stopScreenshare', err);
    }
  }

  async startVoice() {
    try {
      if (!this.audioStream) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.myCard.srcObject = this.audioStream;
      }
      this.audioStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = true));

      this.socket.emit('webRTCStatus', { type: 'voice', status: 'on' });
    } catch (err) {
      console.error('startVoice', err);
      this.setVoiceFunc(false);
      this.stopVoice();
    }
  }

  async stopVoice() {
    try {
      this.audioStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = false));
      this.socket.emit('webRTCStatus', { type: 'voice', status: 'off' });
    } catch (err) {
      console.log('stopVoice', err);
    }
  }
}
