import io from 'socket.io-client';
import UserDataManager from './UserDataManager';

export default class SocketManager {
  constructor() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = this;

    this.callbacks = [];

    this.spaceMessageCallback = null;
    this.roomMessageCallback = null;

    this.setCameraFunc = null;
    this.setScreenFunc = null;
    this.setVoiceFunc = null;

    this.layerUsers = [];
    this.myCard = null;
    this.myScreen = null;
    this.myStream = null;
    this.mediaStream = null;
    this.screenStream = null;
    this.audioStream = null;

    this.peerConnections = {};
    // this.servers = {
    //   iceServers: [
    //     // {
    //     //   urls: [
    //     //     'stun:stun.l.google.com:19302',
    //     //     'stun:stun1.l.google.com:19302',
    //     //     'stun:stun2.l.google.com:19302',
    //     //     'stun:stun3.l.google.com:19302',
    //     //     'stun:stun4.l.google.com:19302',
    //     //   ],
    //     // },
    //     // {
    //     //   urls: 'turn:turn.anyfirewall.com:443',
    //     // },
    //     {
    //       urls: 'stun:stun.relay.metered.ca:80',
    //     },
    //     {
    //       urls: 'turn:seoul.relay.metered.ca:80',
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: 'turn:seoul.relay.metered.ca:80?transport=tcp',
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: 'turn:seoul.relay.metered.ca:443',
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: 'turns:seoul.relay.metered.ca:443?transport=tcp',
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //   ],
    // };

    this.servers = {
      iceServers: [
        // {
        //   urls: 'stun:stun.cloudflare.com:3478',
        // },
        {
          urls: 'turn:turn.cloudflare.com:3478?transport=udp',
          username: process.env.VITE_TURN_USERNAME,
          credential: process.env.VITE_TURN_CREDENTIAL,
        },
        {
          urls: 'turn:turn.cloudflare.com:3478?transport=tcp',
          username: process.env.VITE_TURN_USERNAME,
          credential: process.env.VITE_TURN_CREDENTIAL,
        },
        {
          urls: 'turns:turn.cloudflare.com:5349?transport=tcp',
          username: process.env.VITE_TURN_USERNAME,
          credential: process.env.VITE_TURN_CREDENTIAL,
        },
      ],
    };

    // this.servers = {
    //   iceServers: [
    //     {
    //       urls: [
    //         'stun:stun.l.google.com:19302',
    //         'stun:stun1.l.google.com:19302',
    //         'stun:stun2.l.google.com:19302',
    //         'stun:stun3.l.google.com:19302',
    //         'stun:stun4.l.google.com:19302',
    //       ],
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:80`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:80?transport=tcp`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:433`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:443?transport=tcp`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:3478`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     {
    //       urls: `turn:${process.env.VITE_TURN_IP}:3478?transport=tcp`,
    //       username: process.env.VITE_TURN_USERNAME,
    //       credential: process.env.VITE_TURN_CREDENTIAL,
    //     },
    //     // {
    //     //   urls: 'turn:152.67.196.199:3478',
    //     //   username: 'pachyuchepe',
    //     //   credential: '123100',
    //     // },
    //   ],
    // };
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

    this.myCard = document.getElementById('card_camera');
    if (!this.myCard) {
      this.myCard = document.createElement('video');
      this.myCard.id = `card_camera`;
      this.myCard.autoplay = true;
      this.myCard.muted = true;
      this.myCard.style.width = '160px';
      this.myCard.style.height = '120px';
      this.myCard.style.backgroundColor = 'black';
      this.myCard.style.margin = '4px';
      this.myCard.style.borderRadius = '5px';
      document.getElementById('webrtc-card-container').appendChild(this.myCard);

      this.myCard.style.backgroundImage =
        'url("https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbjRDSj%2FbtsI2et2DUp%2FElFau2y51XvmKMqyqG4qi1%2Fimg.png")';
      this.myCard.style.backgroundSize = 'cover';
      this.myCard.style.backgroundPosition = 'center';
    }
    this.myScreen = document.getElementById('card_screen');
    if (!this.myScreen) {
      this.myScreen = document.createElement('video');
      this.myScreen.id = `card_screen`;
      this.myScreen.autoplay = true;
      this.myScreen.muted = true;
      this.myScreen.style.width = '160px';
      this.myScreen.style.height = '120px';
      this.myScreen.style.backgroundColor = 'black';
      this.myScreen.style.margin = '4px';
      this.myScreen.style.display = 'none';
      document
        .getElementById('webrtc-card-container')
        .appendChild(this.myScreen);
    }

    // 더미 오디오
    this.audioContext = new AudioContext();

    this.socket.on('connect', async (socket) => {});

    this.socket.on('disconnect', async (socket) => {});

    this.socket.on('joinSpace', async (data) => {
      this.publish('joinSpace', data);
    });

    this.socket.on('spaceUsers', async (spaceUsers) => {
      this.publish('spaceUsers', spaceUsers);
    });

    this.socket.on('leaveSpace', (data) => {
      if (data.id != this.socket.id) {
        this.removeCard(data.id);
      } else {
        // 내가 공유 중인거 다 끊기
        for (const key in this.peerConnections) {
          if (this.peerConnections.hasOwnProperty(key)) {
            if (key.includes('res')) {
              const peerConnection = this.peerConnections[key];
              peerConnection.close();
              delete this.peerConnections[key];
            }
          }
        }
      }
      this.publish('leaveSpace', data);
    });

    this.socket.on('joinLayer', async (data) => {
      this.layerUsers.push(data);
      if (data.id != this.socket.id) {
        // console.log('joinLayer', data);
        this.createCard(data);

        // 내가 카메라 공유중일때 들어온사람한테 연결
        if (this.mediaStream) {
          this.createOffer(data.id, 'camera');
        }

        // 내가 카메라 공유중일때 들어온사람한테 연결
        if (this.screenStream) {
          this.createOffer(data.id, 'screen');
        }

        // 내가 마이크 공유중일때 들어온사람한테 연결
        if (this.audioStream) {
          this.createOffer(data.id, 'voice');
        }
      }
      this.publish('joinLayer', data);
    });

    this.socket.on('layerUsers', async (layerUsers) => {
      // 새로운 멤버카드 생성
      layerUsers.forEach((data) => {
        if (data.id != this.socket.id) {
          this.createCard(data);
        }
      });
      this.layerUsers = layerUsers;

      // 내가 카메라 공유중일때 새로운애들 연결
      if (this.mediaStream) {
        this.layerUsers.forEach((user) => {
          if (user.id != this.socket.id) this.createOffer(user.id, 'camera');
        });
      }

      // 내가 화면 공유중일때 새로운애들 연결
      if (this.screenStream) {
        this.layerUsers.forEach((user) => {
          if (user.id != this.socket.id) this.createOffer(user.id, 'screen');
        });
      }

      // 내가 마이크 공유중일때 새로운애들 연결
      if (this.audioStream) {
        this.layerUsers.forEach((user) => {
          if (user.id != this.socket.id) this.createOffer(user.id, 'voice');
        });
      }

      this.publish('layerUsers', layerUsers);
    });

    this.socket.on('leaveLayer', (data) => {
      this.layerUsers = this.layerUsers.filter((user) => user.id !== data.id);

      // 남이 나갈 때
      if (data.id != this.socket.id) {
        this.removeCard(data.id);
      } else {
        // 내가 나갈 때

        // 있던 애들 카드들 삭제
        this.layerUsers.forEach((data) => {
          if (data.id != this.socket.id) {
            this.removeCard(data.id);
          }
        });

        // 내가 공유 중인거 다 끊기
        for (const key in this.peerConnections) {
          if (this.peerConnections.hasOwnProperty(key)) {
            if (key.includes('res')) {
              const peerConnection = this.peerConnections[key];
              peerConnection.close();
              delete this.peerConnections[key];
            }
          }
        }
      }

      this.publish('leaveLayer', data);
    });

    // this.socket.on('sendSpaceMessage', (data) => {
    // });

    this.socket.on('spaceMessage', (data) => {
      this.spaceMessageCallback(data);
    });

    // this.socket.on('sendLayerMessage', (data) => {
    // });

    this.socket.on('layerMessage', (data) => {
      this.roomMessageCallback(data);
    });

    this.socket.on('movePlayer', (data) => {
      this.publish('movePlayer', data);
    });
    this.socket.on('changeNickName', (data) => {
      this.publish('changeNickName', data);
    });
    this.socket.on('changeSkin', (data) => {
      this.publish('changeSkin', data);
    });

    this.socket.on('offer', async (data) => {
      if (data.sender !== this.socket.id) {
        if (!this.peerConnections[`${data.sender}_${data.status}`]) {
          const peerConnection = await this.createAnswerPeerConnection(
            data.sender,
            data.status,
          );
          try {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.sdp),
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            this.socket.emit('answer', {
              sdp: peerConnection.localDescription,
              target: data.sender,
              status: data.status,
            });
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        }
      }
    });

    this.socket.on('answer', async (data) => {
      if (
        data.sender !== this.socket.id &&
        this.peerConnections[`${data.sender}_${data.status}_res`]
      ) {
        try {
          await this.peerConnections[
            `${data.sender}_${data.status}_res`
          ].setRemoteDescription(new RTCSessionDescription(data.sdp));
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    });

    this.socket.on('candidate', async (data) => {
      const name = data.sender + '_' + data.status;
      if (data.sender !== this.socket.id && this.peerConnections[name]) {
        try {
          await this.peerConnections[name].addIceCandidate(
            new RTCIceCandidate(data.candidate),
          );
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    this.socket.on('cameraon', async (id) => {
      if (id != this.socket.id) {
        this.hideCard(id);
      }
    });
    this.socket.on('cameraoff', async (id) => {
      if (id != this.socket.id) {
        const peerConnection = this.peerConnections[`${id}_camera`];
        if (peerConnection) {
          peerConnection.close();
          delete this.peerConnections[`${id}_camera`];
        }

        let video = document.getElementById(`card_${id}_camera`);
        if (video) {
          video.remove();
        } else {
          console.error('상대방의 카메라가 없음');
        }
        this.showCard(id);
      }
    });
    this.socket.on('screenon', async (id) => {});
    this.socket.on('screenoff', async (id) => {
      if (id != this.socket.id) {
        const peerConnection = this.peerConnections[`${id}_screen`];
        if (peerConnection) {
          peerConnection.close();
          delete this.peerConnections[`${id}_screen`];
        }

        let screen = document.getElementById(`card_${id}_screen`);
        if (screen) {
          screen.remove();
        } else {
          console.error('상대방의 카메라가 없음');
        }
      }
    });
    this.socket.on('voiceon', async (id) => {
      if (id != this.socket.id) {
      }
    });
    this.socket.on('voiceoff', async (id) => {
      if (id != this.socket.id) {
        const peerConnection = this.peerConnections[`${id}_voice`];
        if (peerConnection) {
          peerConnection.close();
          delete this.peerConnections[`${id}_voice`];
        }
      }
    });
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

  async createOffer(targetUserId, status) {
    console.log(`createOffer: ${targetUserId}`);
    const peerConnection = await this.createOfferPeerConnection(
      targetUserId,
      status,
    );
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      this.socket.emit('offer', {
        sdp: peerConnection.localDescription,
        target: targetUserId,
        status: status,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  async createOfferPeerConnection(userId, status) {
    console.log(`Creating peer connection for user: ${userId}`);
    const peerConnection = new RTCPeerConnection(this.servers);
    this.peerConnections[`${userId}_${status}_res`] = peerConnection;

    if (status == 'base') {
      this.myStream = new MediaStream();
      const oscillator = this.audioContext.createOscillator();
      const dummyTrack = oscillator
        .connect(this.audioContext.createMediaStreamDestination())
        .stream.getAudioTracks()[0];
      this.myStream.addTrack(dummyTrack);
      if (this.myStream && status == 'base') {
        this.myStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, this.myStream);
        });
      }
    }

    if (this.mediaStream && status == 'camera') {
      this.mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.mediaStream);
      });
    }

    if (this.screenStream && status == 'screen') {
      this.screenStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.screenStream);
      });
    }

    if (this.audioStream && status == 'voice') {
      this.audioStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.audioStream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('요청 candidate', userId);
        this.socket.emit('candidate', {
          candidate: event.candidate,
          target: userId,
          status: status,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      const streamId = stream.id;
      console.log('요청 피어', status, userId);
    };

    return peerConnection;
  }

  async createAnswerPeerConnection(userId, status) {
    const peerConnection = new RTCPeerConnection(this.servers);
    this.peerConnections[`${userId}_${status}`] = peerConnection;

    this.myStream = new MediaStream();
    const oscillator = this.audioContext.createOscillator();
    const dummyTrack = oscillator
      .connect(this.audioContext.createMediaStreamDestination())
      .stream.getAudioTracks()[0];
    this.myStream.addTrack(dummyTrack);
    if (this.myStream) {
      this.myStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, this.myStream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('응답 candidate', userId);
        this.socket.emit('candidate', {
          candidate: event.candidate,
          target: userId,
          status: status,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      const streamId = stream.id;
      console.log('응답 피어', userId);

      if (status == 'camera') {
        let video = document.getElementById(`card_${userId}_camera`);
        if (!video) {
          video = document.createElement('video');
          video.id = `card_${userId}_camera`;
          video.autoplay = true;
          video.muted = true;
          video.width = 160;
          video.height = 120;
          document.getElementById('webrtc-card-container').appendChild(video);
          video.style.backgroundColor = 'black';
          video.style.opacity = 1;
          video.style.borderRadius = '5px';
          video.style.margin = '4px';
        }
        video.style.display = 'block';
        video.srcObject = stream;
        this.hideCard(userId);
      }

      if (status == 'screen') {
        let screen = document.getElementById(`card_${userId}_screen`);
        if (!screen) {
          screen = document.createElement('video');
          screen.id = `card_${userId}_screen`;
          screen.autoplay = true;
          screen.muted = true;
          screen.width = 160;
          screen.height = 120;
          screen.style.borderRadius = '5px';
          document.getElementById('webrtc-card-container').appendChild(screen);
          screen.style.backgroundColor = 'black';
          screen.style.opacity = 1;
          screen.style.margin = '4px';
        }
        screen.style.display = 'block';
        screen.srcObject = stream;
      }
    };

    return peerConnection;
  }

  setMessagCallback(spaceMessageCallback, roomMessageCallback) {
    this.spaceMessageCallback = spaceMessageCallback;
    this.roomMessageCallback = roomMessageCallback;
  }

  setButtonCallback(setCameraFunc, setScreenFunc, setVoiceFunc) {
    this.setCameraFunc = setCameraFunc;
    this.setScreenFunc = setScreenFunc;
    this.setVoiceFunc = setVoiceFunc;
  }

  joinSpace() {
    if (this.socket) {
      this.socket.emit(
        'joinSpace',
        UserDataManager.getInstance().getUserData(),
      );
    }
  }

  movePlayer(x, y) {
    UserDataManager.getInstance().setPosition(x, y);
    if (this.socket) {
      this.socket.emit(
        'movePlayer',
        UserDataManager.getInstance().getUserData(),
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

  sendSpaceMessage(message) {
    if (this.socket) {
      this.socket.emit('sendSpaceMessage', {
        ...UserDataManager.getInstance().getUserData(),
        message,
      });
    }
  }

  ChangeSkin(data) {
    UserDataManager.getInstance().setUserSkinData(data);
    this.socket.emit('changeSkin', UserDataManager.getInstance().getUserData());
  }

  ChangeNickName(nickName) {
    UserDataManager.getInstance().setUserNickName(nickName);
    this.socket.emit(
      'changeNickName',
      UserDataManager.getInstance().getUserData(),
    );
  }

  sendRoomMessage(message) {
    if (this.socket) {
      this.socket.emit('sendLayerMessage', {
        ...UserDataManager.getInstance().getUserData(),
        message,
      });
    }
  }

  async startCamera() {
    try {
      try {
        if (!this.mediaStream) {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          this.mediaStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = true));

          this.myCard.srcObject = this.mediaStream;
          this.myCard.play();
        }
      } catch (error) {
        alert('미디어 장치에 접근할 수 없습니다');
        this.setCameraFunc(false);
        this.stopCamera();
        throw '미디어 장치에 접근할 수 없습니다';
      }

      this.layerUsers.forEach((user) => {
        if (user.id != this.socket.id) this.createOffer(user.id, 'camera');
      });

      this.socket.emit('webRTCStatus', { type: 'camera', status: 'on' });
    } catch (err) {
      console.error('startCamera', err);
      this.setCameraFunc(false);
      this.stopCamera();
    }
  }

  async stopCamera() {
    try {
      this.myCard.srcObject = null;
      this.myCard.pause();
      for (const key in this.peerConnections) {
        if (this.peerConnections.hasOwnProperty(key)) {
          if (key.includes('camera') && key.includes('res')) {
            const peerConnection = this.peerConnections[key];
            peerConnection.close();
            delete this.peerConnections[key];
          }
        }
      }
      this.mediaStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream.getTracks().forEach((track) => {
        this.mediaStream.removeTrack(track);
      });
      this.mediaStream = null;

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

        this.screenStream
          .getVideoTracks()
          .forEach((track) => (track.enabled = true));

        this.screenStream.getVideoTracks()[0].onended = () => {
          // 화면 공유가 중지된 경우의 처리 로직
          this.setScreenFunc(false);
          this.stopScreenShare();
          throw ' 화면 공유 중지';
        };
      }
      this.myScreen.srcObject = this.screenStream;
      this.myScreen.style.display = 'block';

      this.layerUsers.forEach((user) => {
        if (user.id != this.socket.id) this.createOffer(user.id, 'screen');
      });

      this.socket.emit('webRTCStatus', { type: 'screen', status: 'on' });
    } catch (err) {
      console.log('startScreenShare', err);
      // 화면 공유가 취소되었을 때의 처리 로직
      this.setScreenFunc(false);
      this.stopScreenShare();
    }
  }

  async stopScreenShare() {
    try {
      for (const key in this.peerConnections) {
        if (this.peerConnections.hasOwnProperty(key)) {
          if (key.includes('screen') && key.includes('res')) {
            const peerConnection = this.peerConnections[key];
            peerConnection.close();
            delete this.peerConnections[key];
          }
        }
      }
      this.screenStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.screenStream.getTracks().forEach((track) => {
        this.screenStream.removeTrack(track);
      });
      this.screenStream = null;

      this.myScreen.style.display = 'none';

      this.socket.emit('webRTCStatus', { type: 'screen', status: 'off' });
    } catch (err) {
      console.log('stopScreenshare', err);
    }
  }

  async startVoice() {
    try {
      try {
        if (!this.audioStream) {
          this.audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          this.audioStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = true));
        }
      } catch (error) {
        alert('마이크 장치에 접근할 수 없습니다');
        this.setVoiceFunc(false);
        this.stopVoice();
        throw '오디오 장치에 접근할 수 없습니다';
      }

      this.layerUsers.forEach((user) => {
        if (user.id != this.socket.id) this.createOffer(user.id, 'voice');
      });

      this.socket.emit('webRTCStatus', { type: 'voice', status: 'on' });
      // return true;
    } catch (err) {
      console.error('startVoice', err);
      this.setVoiceFunc(false);
      this.stopVoice();
    }
  }

  async stopVoice() {
    try {
      for (const key in this.peerConnections) {
        if (this.peerConnections.hasOwnProperty(key)) {
          if (key.includes('voice') && key.includes('res')) {
            const peerConnection = this.peerConnections[key];
            peerConnection.close();
            delete this.peerConnections[key];
          }
        }
      }
      this.audioStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.audioStream.getTracks().forEach((track) => {
        this.audioStream.removeTrack(track);
      });
      this.audioStream = null;

      this.socket.emit('webRTCStatus', { type: 'voice', status: 'off' });
    } catch (err) {
      console.log('stopVoice', err);
    }
  }

  createCard(data) {
    let card = document.getElementById(`card_${data.id}`);
    if (!card) {
      card = document.createElement('Card');
      card.id = `card_${data.id}`;
      card.autoplay = true;
      card.muted = true;
      card.style.backgroundColor = 'black';
      card.style.margin = '4px';
      card.style.width = '160px';
      card.style.height = '120px';
      card.style.borderRadius = '5px';

      card.style.backgroundImage =
        'url("https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbjRDSj%2FbtsI2et2DUp%2FElFau2y51XvmKMqyqG4qi1%2Fimg.png")';
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';
      document.getElementById('webrtc-card-container').appendChild(card);

      const text = document.createElement('Card.Text');
      text.innerText = data.nickName;
      text.style.color = 'white';
      text.style.fontSize = '14px';
      text.style.fontWeight = 'bold';
      text.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.7)';
      text.style.pointerEvents = 'none';
      card.appendChild(text);
    }
    card.style.display = 'block';
  }

  removeCard(id) {
    let card = document.getElementById(`card_${id}`);
    if (card) {
      card.remove();
    }

    // 나가는 애 카메라 연결 해제, 카드 삭제
    const cameraPeerConnection = this.peerConnections[`${id}_camera`];
    if (cameraPeerConnection) {
      cameraPeerConnection.close();
      delete this.peerConnections[`${id}_camera`];
    }
    let video = document.getElementById(`card_${id}_camera`);
    if (video) {
      video.remove();
    }

    // 나가는 애 화면 연결 해제, 카드 삭제
    const screenPeerConnection = this.peerConnections[`${id}_screen`];
    if (screenPeerConnection) {
      screenPeerConnection.close();
      delete this.peerConnections[`${id}_screen`];
    }
    let screen = document.getElementById(`card_${id}_screen`);
    if (screen) {
      screen.remove();
    }

    // 나가는 애 마이크 연결 해제
    const voicePeerConnection = this.peerConnections[`${id}_voice`];
    if (voicePeerConnection) {
      voicePeerConnection.close();
      delete this.peerConnections[`${id}_voice`];
    }
  }

  hideCard(id) {
    let card = document.getElementById(`card_${id}`);
    if (card) {
      card.style.display = 'none';
    }
  }
  showCard(id) {
    let card = document.getElementById(`card_${id}`);
    if (card) {
      card.style.display = 'block';
    }
  }
}
