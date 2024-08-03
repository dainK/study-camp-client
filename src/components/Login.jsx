import React from 'react';
import './styles/Login.css';
import Title from './Title';

function Login() {
  return (
    <>
      <Title />
      <div className="login-container">
        <div className="login-box">
          <div className="login-card">
            <h1>Login</h1>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
              <button type="button" className="google-login-button">
                Login with Google
              </button>
              <button type="button" className="kakao-login-button">
                Login with Kakao
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
