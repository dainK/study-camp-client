// Header.js
import React from 'react';
// import title from './images/title.png';
import './styles/Header.css';
import { Link } from 'react-router-dom';
// import { requestChekLogin, requestLogout } from '../util/request';
import UserDataManager from '../util/UserDataManager';
class Header extends React.Component {
  state = {
    isUser: false,
  };

  async componentDidMount() {
    try {
      // const check = await requestChekLogin();
      const isLogin = await UserDataManager.getInstance().checkLogin();
      this.setState({ isUser: isLogin });
    } catch (error) {
      this.setState({ isUser: false });
    }
  }

  logout = async () => {
    // const res = await requestLogout();
    // console.log(res);
    UserDataManager.getInstance().logOut();
    this.setState({ isUser: false });
  };

  render() {
    const { isUser } = this.state;
    return (
      <header className="header">
        <div className="headContainer">
          <div className="headLeft">
            <Link to="/" className="headButton">
              <img src={`${process.env.VITE_CLIENT_URL}/title.png`} />
            </Link>
            <div
              className="menuItem"
              // onClick={() => console.log('소개 클릭됨')}
            >
              소개
            </div>
            <div
              className="menuItem"
              // onClick={() => console.log('가격 클릭됨')}
            >
              가격
            </div>
          </div>
          <div className="headRight">
            {!isUser && (
              <>
                <Link to="/login" className="headButton">
                  로그인
                </Link>
                <Link to="/signup" className="headButton">
                  회원가입
                </Link>
              </>
            )}

            {isUser && (
              <>
                <button className="logoutButton" onClick={this.logout}>
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
