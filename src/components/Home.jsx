import React from 'react';
import Header from './Header';
import Notice from './Notice';
import List from './List';
import './styles/Home.css';

function Home() {
  return (
    <div>
      <Header />

      <div className="home">
        <div className="homeContainer">
          <Notice />
          <List />
        </div>
      </div>
    </div>
  );
}

export default Home;
