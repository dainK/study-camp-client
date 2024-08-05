import React from 'react';
import './styles/Title.css';
import { Link } from 'react-router-dom';

class Title extends React.Component {
  render() {
    return (
      <>
        <header className="title">
          <div className="titleContainer">
            <div className="titleLeft">
              <Link to="/" className="titleButton">
                <img src={`./title.png`} />
              </Link>
            </div>
            <div></div>
          </div>
        </header>
      </>
    );
  }
}

export default Title;
