import React from 'react';
import './styles/Signup.css';
import Title from './Title';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import {
  requestSignup,
  handleKakaoLogin,
  handleGoogleLogin,
} from '../util/request';

class Signup extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');
    const nick_name = formData.get('nick_name');

    const res = await requestSignup({
      email,
      password,
      passwordConfirm,
      nick_name,
    });

    if (!!res && !!res.data) {
      console.log(res.data);
      alert('회원가입 성공');
      window.location.href = `${process.env.VITE_GITHUB_PAGE}/`;
    } else {
      alert('회원가입 실패');
    }
  };
  render() {
    return (
      <>
        <Title />
        <div className="signup-container">
          <div className="signup-box">
            <div className="signup-card">
              <h1>Sign up</h1>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="signup" className="form-group">
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <br></br>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <br></br>
                  <Form.Control
                    type="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    placeholder="Password confirm"
                    required
                  />
                  <br></br>
                  <Form.Control
                    type="text"
                    id="nick_name"
                    name="nick_name"
                    placeholder="Nick name"
                    required
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="signup-button"
                >
                  Sign up
                </Button>
                <div className="button-box">
                  <button
                    type="button"
                    className="google-signup-button "
                    onClick={handleGoogleLogin}
                  >
                    Sign up with Google
                  </button>
                  <button
                    type="button"
                    className="kakao-signup-button"
                    onClick={handleKakaoLogin}
                  >
                    Sign up with Kakao
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Signup;
