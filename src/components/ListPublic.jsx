import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일을 임포트합니다.
import { Link } from 'react-router-dom';
import './styles/List.css';

class ListPublic extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
    };

    return (
      <>
        {/* <div className="list"> */}
        {/* <div className="listContainer"> */}
        <div className="uiContainer">
          <div className="uiLeft">
            <div
              className="textItem"
              onClick={() => console.log('참여한 학습 공간 클릭됨')}
            >
              전체 학습 공간
            </div>
          </div>
          <div className="uiRight">
            <input className="searchinput" placeholder="학습 공간 검색"></input>
            {/* <button className="createButton">학습 공간 만들기</button> */}
            {/* <button className="headButton" onClick={this.onClickSignupButton}>회원가입</button> */}
          </div>
        </div>

        <div className="listSliberContainer">
          <div className="slider-container">
            <Slider {...settings}>
              <div>
                <Card
                  style={{ margin: '3%', width: '94%', aspectRatio: '2/1' }}
                >
                  <Card.Img
                    src="https://via.placeholder.com/800x400"
                    alt="Card image"
                  />
                  {/* <Card.ImgOverlay>
                        <Card.Title>테스트 스페이스</Card.Title>
                        <Card.Text>스페이스 입장</Card.Text>
                      </Card.ImgOverlay> */}
                </Card>
              </div>
              <div>
                <Card
                  style={{ margin: '3%', width: '94%', aspectRatio: '2/1' }}
                >
                  <Card.Img
                    src="https://via.placeholder.com/800x400"
                    alt="Card image"
                  />
                  {/* <Card.ImgOverlay>
                      <Card.Title>공지 2</Card.Title>
                      <Card.Text>공지 내용 2</Card.Text>
                    </Card.ImgOverlay> */}
                </Card>
              </div>
              <div>
                <Card
                  style={{ margin: '3%', width: '94%', aspectRatio: '2/1' }}
                >
                  <Card.Img
                    src="https://via.placeholder.com/800x400"
                    alt="Card image"
                  />
                  {/* <Card.ImgOverlay>
                      <Card.Title>공지 2</Card.Title>
                      <Card.Text>공지 내용 2</Card.Text>
                    </Card.ImgOverlay> */}
                </Card>
              </div>
            </Slider>
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </>
    );
  }
}

export default ListPublic;
