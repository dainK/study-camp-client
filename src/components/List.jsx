import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일을 임포트합니다.
import { Link } from 'react-router-dom';
import './styles/List.css';
import ListPublic from './ListPublic';
import ListUserSpace from './ListUserSpace';

class List extends React.Component {
  render() {
    return (
      <div className="list">
        <div className="listContainer">
          <ListUserSpace />
          <ListPublic />
        </div>
      </div>
    );
  }
}

export default List;
