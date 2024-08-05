import React, { useState, useEffect } from 'react';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일을 임포트합니다.
import './styles/List.css';
import { requestAllSpaceList } from '../util/request';
import ReactPaginate from 'react-paginate';
import EnterSpaceModal from './modal/EnterSpaceModal';

const ListPublic = () => {
  const [spaceList, setSpaceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // 기본 페이지당 아이템 수
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(10); // 페이지 버튼 수 초기값

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spaces = await requestAllSpaceList();
        setSpaceList(spaces);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updatePageRange = () => {
      const width = window.innerWidth;

      if (width <= 600) {
        setItemsPerPage(6); // 600px 이하일 때 3컬럼
      } else if (width <= 800) {
        setItemsPerPage(8); // 800px 이하일 때 4컬럼
      } else {
        setItemsPerPage(10); // 800px 초과일 때 6컬럼
      }
    };

    updatePageRange(); // 컴포넌트 마운트 시 초기화
    window.addEventListener('resize', updatePageRange);

    return () => window.removeEventListener('resize', updatePageRange);
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleCardClick = (space) => {
    setShowModal(true);
    setSelectedSpace(space);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSpace(null);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const password = formData.get('password');
    console.log('비밀번호:', password);
  };

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(spaceList.length / itemsPerPage);
  const currentSpaceList = spaceList.slice(offset, offset + itemsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="uiContainer">
        <div className="uiLeft">
          <div
            className="textItem"
            onClick={() => console.log('전체 학습 공간 클릭됨')}
          >
            전체 학습 공간
          </div>
        </div>
        <div className="uiRight">
          <input className="searchinput" placeholder="학습 공간 검색" />
        </div>
      </div>

      <div className="listGridContainer">
        <div className="grid-container">
          {Array.isArray(currentSpaceList) &&
            currentSpaceList.map((space, index) => (
              <div key={index} className="grid-item">
                <Card
                  style={{ margin: '3%', aspectRatio: '2/1' }}
                  onClick={() => handleCardClick(space)}
                  role="button"
                >
                  <Card.Img
                    src={
                      space.image_url ||
                      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbUljpJ%2FbtsISVoAu1d%2F67ykGPycZ25d0Cx7Oq3Ci1%2Fimg.png'
                    }
                    alt="Card image"
                  />
                  <Card.ImgOverlay>
                    <span className="count-text">{space.membersCount}명</span>
                  </Card.ImgOverlay>
                </Card>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <h5>{space.name}</h5>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={setPageRangeDisplayed} // 동적으로 설정된 페이지 버튼 수
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {selectedSpace && (
        <EnterSpaceModal
          show={showModal}
          handleClose={handleCloseModal}
          space={selectedSpace}
        />
      )}
    </>
  );
};

export default ListPublic;
