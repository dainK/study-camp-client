import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateSpaceModal = ({ show, handleClose }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 학습공간 생성 로직 처리
    console.log({
      name,
      image,
      content,
      isPublic,
      password: isPublic ? null : password,
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>학습공간 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>학습공간 이름</Form.Label>
            <Form.Control
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formImage" className="mt-3">
            <Form.Label>학습공간 썸네일</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {image && (
              <div className="mt-3">
                <img
                  src={image}
                  style={{ width: '100%', aspectRatio: '2 / 1' }}
                />
              </div>
            )}
            {!image && (
              <div className="mt-3">
                <img
                  src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbUljpJ%2FbtsISVoAu1d%2F67ykGPycZ25d0Cx7Oq3Ci1%2Fimg.png"
                  style={{ width: '100%', aspectRatio: '2 / 1' }}
                />
              </div>
            )}
          </Form.Group>
          <Form.Group controlId="formContent" className="mt-3">
            <Form.Label>학습공간 소개</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>공개 여부</Form.Label>
            <div>
              <Form.Check
                inline
                label="공개"
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
              />
              <Form.Check
                inline
                label="비공개"
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
              />
            </div>
          </Form.Group>
          {!isPublic && (
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            style={{ width: '100%' }}
          >
            학습공간 생성하기
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSpaceModal;
