import React from 'react';
import './styles/Title.css';

class Title extends React.Component {
  render() {
    return (
      <>
        <header className="title">
          <div className="titleContainer">
            <div className="titleLeft">
              <a href="/">
                <img src={`./title.png`} />
              </a>
            </div>
            <div></div>
          </div>
        </header>
      </>
    );
  }
}

export default Title;
