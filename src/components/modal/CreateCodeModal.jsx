import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requestCreateCode } from '../../util/request';

const CreateCodeModal = ({ show, handleClose }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [copied, setCopied] = useState(false);
  const inputsRef = useRef([]);

  useEffect(async () => {
    if (show) {
      let newCode = '';
      const res = requestCreateCode();
      if (!!res && !!res.data) {
        newCode = res.data.code;
      }
      setCode(newCode.split(''));
    }
  }, [show]);

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value.toUpperCase();
    setCode(newCode);

    // 자동으로 다음 칸으로 이동
    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !code[index]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleCopy = () => {
    const inviteCode = code.join('');
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후에 복사 알림 사라지기
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>초대코드</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="d-flex justify-content-between mb-3">
            {code.map((_, index) => (
              <Form.Control
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                style={{
                  width: '3rem',
                  height: '3rem',
                  textAlign: 'center',
                  fontSize: '2rem',
                }}
                readOnly
              />
            ))}
          </div>
          <Button
            variant="outline-primary"
            onClick={handleCopy}
            style={{ width: '100%' }}
          >
            {copied ? '복사됨!' : '복사하기'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCodeModal;
