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
    speed: 5000,
    autoplaySpeed: 2000,
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
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fba7L4D%2FbtsITk2KPVl%2FDXivyJm0LF3UzcUp93MGT0%2Fimg.png"
                    alt="Card image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // 이미지를 비율에 맞게 잘라서 보여줌
                    }}
                  />

                  {/* <Card.ImgOverlay>
                    <Card.Title
                      style={{
                        // color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      캐릭터 이동
                    </Card.Title>
                  </Card.ImgOverlay> */}
                </Card>
              </div>
              <div>
                <Card
                  style={{
                    margin: '3%',
                    width: '94%',
                    aspectRatio: '2/1',
                    overflow: 'hidden',
                  }}
                >
                  <Card.Img
                    src="https://blog.kakaocdn.net/dn/bvmv2T/btsI7VmMByF/RYzOXqhNqaqOw7WFtZat4K/img.gif"
                    alt="Card image"
                    style={{
                      // width: '100%',
                      height: '100%',
                      objectFit: 'cover', // 이미지를 비율에 맞게 잘라서 보여줌
                    }}
                  />

                  <Card.ImgOverlay>
                    <Card.Title
                      style={{
                        // color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      캐릭터 꾸미기
                    </Card.Title>
                    {/* <Card.Text>공지 내용 2</Card.Text> */}
                  </Card.ImgOverlay>
                </Card>
              </div>
              <div>
                <Card
                  style={{ margin: '3%', width: '94%', aspectRatio: '2/1' }}
                >
                  <Card.Img
                    src="https://blog.kakaocdn.net/dn/bIpVwZ/btsI6yfwdLl/uYRQLltAfejosIkkTcO9Vk/img.gif"
                    alt="Card image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // 이미지를 비율에 맞게 잘라서 보여줌
                    }}
                  />
                  <Card.ImgOverlay>
                    <Card.Title
                      style={{
                        // color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      WebRTC
                    </Card.Title>
                    <Card.Text
                      style={{
                        // color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      화상통화, 화면공유
                    </Card.Text>
                  </Card.ImgOverlay>
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
