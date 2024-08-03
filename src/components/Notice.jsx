import React from 'react';
import Slider from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일을 임포트합니다.
// import { Link } from 'react-router-dom';
import './styles/Notice.css';

const Notice = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });
  const isMediumScreen = useMediaQuery({ query: '(max-width: 1000px) ' });

  let slidesToShow = 3;
  if (isSmallScreen) {
    slidesToShow = 1;
  } else if (isMediumScreen) {
    slidesToShow = 2;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 1000,
    cssEase: 'linear',
  };
  return (
    <div className="notice">
      <div className="noticeContainer">
        <div className="noticeSliberContainer">
          <div className="slider-container">
            <Slider
              {...settings}
              style={{ backgroundColor: '#226699', borderRadius: '5px' }}
            >
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
      </div>
    </div>
  );
};

export default Notice;
