import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Modal.css';
import { requestEnterSpace } from '../../util/request';

const EnterSpaceModal = ({ show, handleClose, space, isUserSpace }) => {
  const [password, setPassword] = useState('');
  console.log(space);
  const [isPublic, setIsPublic] = useState(space.isPublic);
  const [isUser, setIsUser] = useState(isUserSpace);

  const handleSubmit = async (e) => {
    console.log(isPublic);
    e.preventDefault();
    // 비밀번호를 검증하고 공간에 입장하는 로직을 추가합니다.
    if (isPublic) {
      const res = await requestEnterSpace({
        spaceId: space.id,
        password: '',
      });
      console.log(res);
      if (!!res && !!res.url) {
        window.location.href = `${process.env.VITE_GITHUB_PAGE}/space/${res.url}`;
      } else {
        alert('입장에 실패했습니다.');
      }
    } else {
      const formData = new FormData(event.target);
      const res = await requestEnterSpace({
        spaceId: space.id,
        password: formData.get('password'),
      });
      if (!!res && !!res.url) {
        window.location.href = `${process.env.VITE_GITHUB_PAGE}/space/${res.url}`;
      } else {
        alert('비밀번호가 맞지 않습니다.');
      }
    }
    handleClose(); // 모달을 닫습니다.
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{space?.name || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="mt-3 position-relative">
            <img
              src={
                space?.image_url ||
                'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbUljpJ%2FbtsISVoAu1d%2F67ykGPycZ25d0Cx7Oq3Ci1%2Fimg.png'
              }
              alt="Thumbnail"
              style={{ width: '100%', aspectRatio: '2 / 1', display: 'block' }}
            />
            {/* 텍스트를 이미지 위에 배치 */}
            <div className="position-absolute top-50 start-50 translate-middle">
              <span className="text-overlay">{space?.membersCount || 0}명</span>
            </div>
          </div>

          <p>{space?.content || ''}</p>

          {/* 비공개일 경우 비밀번호 입력 필드 */}
          {!isPublic && !isUser && (
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>비공개 방입니다</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {/* 학습공간 입장하기 버튼 */}
          <Button
            variant="primary"
            type="submit"
            className="mt-4"
            style={{ width: '100%' }}
          >
            학습공간 입장하기
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EnterSpaceModal;
