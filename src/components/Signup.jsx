import React from 'react';
import './styles/Signup.css';
import Title from './Title';

function Signup() {
  return (
    <>
      <Title />
      <div className="signup-container">
        <div className="signup-box">
          <div className="signup-card">
            <h1>Sign up</h1>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password confirm</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Nick name</label>
                <input type="text" id="nick_name" name="nick_name" required />
              </div>
              <button type="submit" className="signup-button">
                Sign up
              </button>
              <div className="button-box">
                <button type="button" className="google-signup-button">
                  Sign up with Google
                </button>
                <button type="button" className="kakao-signup-button">
                  Sign up with Kakao
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
