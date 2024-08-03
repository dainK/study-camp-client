// Header.js
import React from 'react';
// import title from './images/title.png';
import './styles/Header.css';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  onClickLoginButton = () => {
    // /login로 이동
  };
  onClickSignupButton = () => {
    // /signup 이동
  };

  render() {
    return (
      <header className="header">
        <div className="headContainer">
          <div className="headLeft">
            <a href="/">
              <img
                src={`./title.png`}
                // style={{ width: '350px', height: '60px' }}
              />
            </a>
            <div
              className="menuItem"
              onClick={() => console.log('소개 클릭됨')}
            >
              소개
            </div>
            <div
              className="menuItem"
              onClick={() => console.log('가격 클릭됨')}
            >
              가격
            </div>
          </div>
          <div className="headRight">
            {/* <button className="headButton" onClick={this.onClickLoginButton}>로그인</button> */}
            {/* <button className="headButton" onClick={this.onClickSignupButton}>회원가입</button> */}
            <Link to="/login" className="headButton">
              로그인
            </Link>
            <Link to="/signup" className="headButton">
              회원가입
            </Link>
            {/* <a href="/login" className="headButton">
            로그인
    </a>
            <a href="/signup" className="headButton">
            회원가입
    </a> */}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
