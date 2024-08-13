// src/components/modal/ChangeNickModal.js
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChangeNickModal = ({ isOpen, onClose }) => {
  const handleSubmit = (e) => {};

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>닉네임 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNickname">
            {/* <Form.Label>새 닉네임</Form.Label> */}
            <Form.Control type="text" placeholder="새 닉네임을 입력하세요" />
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
