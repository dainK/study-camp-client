import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requestCreateCode } from '../../util/request';
import UserDataManager from '../../util/UserDataManager';

const CreateCodeModal = ({ show, handleClose }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후에 복사 알림 사라지기
    });
  };

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const spaceId = UserDataManager.getInstance().getUserData().spaceId;
        const res = await requestCreateCode(spaceId); // 비동기 호출
        if (res && res.data) {
          setCode(res.data.code); // 코드 상태 업데이트
        }
      } catch (error) {
        console.error('Failed to fetch code:', error);
      }
    };

    if (show) {
      fetchCode(); // 모달이 열릴 때 코드 요청
    }
  }, [show]); // `show`가 변경될 때마다 실행

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>초대코드</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              value={code}
              readOnly
              style={{
                textAlign: 'center',
                fontSize: '2rem',
                letterSpacing: '0.1em',
              }}
            />
          </Form.Group>
          <Button
            variant="outline-primary"
            onClick={handleCopy}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {copied ? '복사됨!' : '복사하기'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCodeModal;
