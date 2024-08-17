import React, { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { requestEnterCode } from '../../util/request';

const InputCodeModal = ({ show, handleClose }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').toUpperCase();
    const newCode = pasteData.slice(0, 6).split(''); // 최대 6자리까지

    setCode((prevCode) => {
      const updatedCode = [...prevCode];
      newCode.forEach((char, i) => {
        updatedCode[i] = char;
      });
      return updatedCode;
    });

    // 자동으로 마지막 칸으로 이동
    if (newCode.length === 6) {
      inputsRef.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inviteCode = code.join('');
    // console.log('Invite Code:', inviteCode);

    const data = await requestEnterCode(inviteCode);
    if (data) {
      window.location.href = `${process.env.VITE_GITHUB_PAGE}/space/${data.url}`;
    } else {
      alert('유효하지 않은 초대 코드입니다.');
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>초대코드 입력</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between">
            {code.map((_, index) => (
              <Form.Control
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                style={{
                  width: '3rem',
                  height: '3rem',
                  textAlign: 'center',
                  fontSize: '2rem',
                }}
              />
            ))}
          </div>
          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            style={{ width: '100%' }}
          >
            입장하기
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InputCodeModal;
