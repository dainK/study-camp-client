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
    this.myStream = null;
    this.mediaStream = null;
    this.screenStream = null;
    this.audioStream = null;

    this.peerConnections = {};
    this.servers = {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
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
      this.myCard.muted = true;
      this.myCard.width = 160;
      this.myCard.height = 120;
      this.myCard.style.backgroundColor = 'white'; // 원하는 색상으로 변경 가능
      this.myCard.style.margin = '4px'; // 원하는 색상으로 변경 가능
      document.getElementById('webrtc-card-container').appendChild(this.myCard);
    }

    // 더미 오디오
    this.audioContext = new AudioContext();

    // try {
    //   if (!this.audioStream) {
    //     this.audioStream = await await navigator.mediaDevices.getUserMedia({
    //       audio: true,
    //     });
    //     this.audioStream
    //       .getAudioTracks()
    //       .forEach((track) => (track.enabled = false));
    //   }
    // } catch (error) {
    //   // console.error('미디어 장치에 접근할 수 없습니다:', error);
    //   // alert('카메라 또는 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    // }

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
      this.removeCard(data);
    });

    this.socket.on('joinSpace', async (data) => {
      this.publish('joinSpace', data);
    });

    this.socket.on('spaceUsers', async (spaceUsers) => {
      this.publish('spaceUsers', spaceUsers);
    });

    this.socket.on('leaveSpace', (data) => {
      // console.log('leaveSpace', data);
      this.removeCard(data);

      // let video = document.getElementById(`card_${data.id}_camera`);
      // if (video) {
      //   video.style.display = 'none';
      //   video.remove();
      // }
      // this.stopStreams();
      this.publish('leaveSpace', data);
    });

    this.socket.on('joinLayer', async (data) => {
      if (data.id != this.socket.id) {
        this.layerUsers.push(data);
        console.log('joinLayer', data);
        this.createCard(data);
        if (this.mediaStream) {
          this.createOffer(data.id, 'media');
          this.hideCard(data.id);
        }
      }
      this.publish('joinLayer', data);
    });

    this.socket.on('layerUsers', async (layerUsers) => {
      console.log('Layer users', layerUsers);
      this.layerUsers.forEach((data) => {
        if (data.id != this.socket.id) {
          this.removeCard(data);
        }
      });
      // this.cleanUpConnections(); // 기존 연결 정리
      // await this.handleNewLayerUsers(layerUsers);
      layerUsers.forEach((data) => {
        if (data.id != this.socket.id) {
          this.createCard(data);
        }
      });
      this.layerUsers = layerUsers;

      this.publish('layerUsers', layerUsers);
    });

    this.socket.on('leaveLayer', (data) => {
      console.log('Left layer', data);
      this.layerUsers = this.layerUsers.filter((user) => user.id !== data.id);

      // if (data.id != this.socket.id) {
      //   let video = document.getElementById(`card_${data.id}_camera`);
      //   if (video) {
      //     video.style.display = 'none';
      //   }
      // }
      this.removeCard(data);

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
      // console.log(`Received offer from user: ${data.sender}`);
      if (data.sender !== this.socket.id) {
        const name = data.sender + '_' + data.status;
        // console.log(`offer`);
        if (!this.peerConnections[name]) {
          console.log(`createAnswer`);
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
      // const { answer, socketId } = data;
      // await this.handleAnswer(answer, socketId);
      // console.log(`Received answer from user: ${data.sender}`);
      const name = data.sender + '_' + data.status + '_res';
      console.log('answer');
      if (data.sender !== this.socket.id && this.peerConnections[name]) {
        try {
          await this.peerConnections[name].setRemoteDescription(
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
      console.log(`candidate: ${data.sender}`);
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
      } else {
      }
    });
    this.socket.on('cameraoff', async (id) => {
      if (id != this.socket.id) {
        for (const key in this.peerConnections) {
          if (this.peerConnections.hasOwnProperty(key)) {
            // Check if the key includes 'camera' or 'res'
            if (key.includes('camera') && key.includes(`${id}`)) {
              // Get the peer connection
              const peerConnection = this.peerConnections[key];
              // 1. 모든 트랙을 중지하고 제거합니다
              peerConnection.getReceivers().forEach((receiver) => {
                const track = receiver.track;
                if (track) {
                  track.stop();
                }
              });

              // 2. 연결된 스트림을 제거합니다
              peerConnection.getTransceivers().forEach((transceiver) => {
                transceiver.sender.replaceTrack(null);
              });

              // 3. 연결을 종료합니다
              peerConnection.close();

              // 4. peerConnections에서 해당 피어의 정보를 삭제합니다
              delete this.peerConnections[key];
            }
          }
        }
        let video = document.getElementById(`card_${id}_camera`);
        if (video) {
          // video.style.backgroundColor = 'white';
          video.remove();
        } else {
          console.error('상대방의 카메라가 없음');
        }
        this.showCard(id);
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

  async createOffer(targetUserId, status) {
    console.log(`createOffer: ${targetUserId}`);
    const peerConnection = this.createOfferPeerConnection(targetUserId, status);
    try {
      const offer = await peerConnection.createOffer();
      // console.log(`Created offer for user: ${targetUserId}`);
      await peerConnection.setLocalDescription(offer);
      // console.log(`Set local description for user: ${targetUserId}`);
      this.socket.emit('offer', {
        sdp: peerConnection.localDescription,
        target: targetUserId,
        status: status,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  createOfferPeerConnection(userId, status) {
    console.log(`Creating peer connection for user: ${userId}`);
    const peerConnection = new RTCPeerConnection(this.servers);
    const name = userId + '_' + status + '_res';
    this.peerConnections[name] = peerConnection;

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
        // }
      }
    }

    if (this.mediaStream && status == 'media') {
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
      // console.log(`candidate 요청`);
      if (event.candidate) {
        // console.log(`candidate 받음: ${userId}`);
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
    // console.log(`Creating peer connection for user: ${userId}`);
    const peerConnection = new RTCPeerConnection(this.servers);
    const name = userId + '_' + status;
    this.peerConnections[name] = peerConnection;

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
        // console.log(`candidate: ${userId}`);
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

      if (status == 'media') {
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
        }
        video.srcObject = stream;
        // console.log(stream.getVideoTracks());
      }
      if (status == 'screen') {
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
      try {
        if (!this.mediaStream) {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          this.mediaStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = true));

          this.myCard.srcObject = this.mediaStream;
        }
      } catch (error) {
        this.setCameraFunc(false);
        this.stopCamera();
        console.error('미디어 장치에 접근할 수 없습니다:', error);
      }

      this.layerUsers.forEach((user) => {
        this.createOffer(user.id, 'media');
      });

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
      for (const key in this.peerConnections) {
        if (this.peerConnections.hasOwnProperty(key)) {
          // Check if the key includes 'camera' or 'res'
          if (key.includes('camera') && key.includes('res')) {
            // Get the peer connection
            const peerConnection = this.peerConnections[key];

            // Close the peer connection
            peerConnection.close();

            // Remove the peer connection from the object
            delete this.peerConnections[key];
          }
        }
      }
      // Disable all video tracks in mediaStream
      this.mediaStream.getVideoTracks().forEach((track) => {
        track.stop(); // Stop the track to release resources
        // Optionally set the track.enabled to false if you need to disable it, but stopping it is usually sufficient
      });

      // Remove all tracks from the mediaStream
      this.mediaStream.getTracks().forEach((track) => {
        this.mediaStream.removeTrack(track);
      });

      // Set mediaStream to null
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
        this.screenStream.getVideoTracks()[0].onended = () => {
          // 화면 공유가 중지된 경우의 처리 로직
          this.setScreenFunc(false);
          this.stopScreenshare();
        };
      }

      this.screenStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = true));

      // Object.keys(this.peerConnections).forEach((peerId) => {
      //   // for (const peerId in peers) {

      //   this.screenStream.getTracks().forEach((track) => {
      //     this.peerConnections[peerId].addTrack(track, this.screenStream);
      //   });
      // });

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
  }

  removeCard(data) {
    let card = document.getElementById(`card_${data.id}`);
    if (card) {
      card.remove();
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
