// src/components/modal/ChangeNickModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requestChangeNickName } from '../../util/request';
import UserDataManager from '../../util/UserDataManager';
import SocketManager from '../../util/SocketManager';

const ChangeNickModal = ({ isOpen, onClose }) => {
  const addListener = () => {
    UserDataManager.getInstance().setStateChat(true);
  };

  const removeListener = () => {
    UserDataManager.getInstance().setStateChat(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nickName = formData.get('nickName');

    const data = { nickName };
    const isLogin = UserDataManager.getInstance().isLogin;
    if (isLogin) {
      const res = await requestChangeNickName(data);
      if (!res) {
        alert('유저 데이터 저장에 실패 하였습니다.');
      }
    }
    SocketManager.getInstance().ChangeNickName(nickName);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>닉네임 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNickname">
            {/* <Form.Label>새 닉네임</Form.Label> */}
            <Form.Control
              name="nickName"
              type="text"
              placeholder="새 닉네임을 입력하세요"
              onFocus={addListener}
              onBlur={removeListener}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            style={{ width: '100%' }}
          >
            변경
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeNickModal;
