import React from 'react';
import './styles/Login.css';
import Title from './Title';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import {
  requestLogin,
  handleKakaoLogin,
  handleGoogleLogin,
} from '../util/request';

class Login extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await requestLogin({ email, password });
    if (!!res && !!res.data && res.data.access_token) {
      window.location.href = `${process.env.VITE_GITHUB_PAGE}/`;
    } else {
      alert('로그인에 실패하였습니다.');
    }
  };
  render() {
    return (
      <>
        <Title />
        <div className="login-container">
          <div className="login-box">
            <div className="login-card">
              <h1>Login</h1>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="login" className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="이메일을 입력하세요"
                    required
                  />
                  <br></br>
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="login-button"
                >
                  Login
                </Button>
                <button
                  type="button"
                  className="google-login-button"
                  onClick={handleGoogleLogin}
                >
                  Login with Google
                </button>
                <button
                  type="button"
                  className="kakao-login-button"
                  onClick={handleKakaoLogin}
                >
                  Login with Kakao
                </button>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
