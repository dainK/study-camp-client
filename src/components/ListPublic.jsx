import React, { useState, useEffect, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [filteredSpaceList, setFilteredSpaceList] = useState([]); // 필터된 목록 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spaces = await requestAllSpaceList();
        setSpaceList(spaces);
        setFilteredSpaceList(spaces); // 초기 목록 설정
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
        setItemsPerPage(4); // 600px 이하일 때 3컬럼
      } else if (width <= 800) {
        setItemsPerPage(6); // 800px 이하일 때 4컬럼
      } else {
        setItemsPerPage(8); // 800px 초과일 때 6컬럼
      }
    };

    updatePageRange(); // 컴포넌트 마운트 시 초기화
    window.addEventListener('resize', updatePageRange);

    return () => window.removeEventListener('resize', updatePageRange);
  }, []);

  useEffect(() => {
    // searchTerm 변경될 때만 필터링 수행
    const filteredList = spaceList.filter((space) =>
      space.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredSpaceList(filteredList);
    setCurrentPage(0); // 검색어 변경 시 페이지 초기화
  }, [searchTerm, spaceList]);

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

  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(filteredSpaceList.length / itemsPerPage);
  const currentSpaceList = filteredSpaceList.slice(
    offset,
    offset + itemsPerPage,
  );

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
            // onClick={() => console.log('전체 학습 공간 클릭됨')}
          >
            전체 학습 공간
          </div>
        </div>
        <div className="uiRight">
          <input
            className="searchinput"
            placeholder="학습 공간 검색"
            onChange={(e) => setSearchTerm(e.target.value)} // 입력시마다 searchTerm 상태 변경
          />
        </div>
      </div>
      <div className="listGridContainer">
        <div className="grid-container">
          {currentSpaceList.map((space, index) => (
            <div key={index} className="grid-item">
              <Card
                style={{
                  margin: '3%',
                  aspectRatio: '2 / 1',
                  width: '100%',
                  overflow: 'hidden', // 이미지가 넘치는 경우를 방지
                }}
                onClick={() => handleCardClick(space)}
                role="button"
              >
                <Card.Img
                  src={
                    space.image_url ||
                    'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbUljpJ%2FbtsISVoAu1d%2F67ykGPycZ25d0Cx7Oq3Ci1%2Fimg.png'
                  }
                  alt="Card image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // 이미지를 비율에 맞게 잘라서 보여줌
                  }}
                />
                <Card.ImgOverlay
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'end',
                  }}
                >
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
        pageRangeDisplayed={5} // 정해진 숫자로 설정
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {selectedSpace && (
        <EnterSpaceModal
          show={showModal}
          handleClose={handleCloseModal}
          space={selectedSpace}
          isUserSpace={false}
        />
      )}
    </>
  );
};

export default ListPublic;
