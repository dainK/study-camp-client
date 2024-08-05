import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 스타일을 임포트합니다.
import './styles/List.css';
import { requestChekLogin, requestAllSpaceList } from '../util/request';
import ReactPaginate from 'react-paginate';
import EnterSpaceModal from './modal/EnterSpaceModal';
import CreateSpaceModal from './modal/CreateSpaceModal';
import InviteCodeModal from './modal/InviteCodeModal';

const ListUserSpace = () => {
  const [spaceList, setSpaceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // 기본 페이지당 아이템 수
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(10); // 페이지 버튼 수 초기값

  useEffect(() => {
    const fetchData = async () => {
      try {
        const check = await requestChekLogin();
        if (check) {
          const spaces = await requestAllSpaceList();
          setSpaceList(spaces);
        } else {
          setSpaceList([]);
        }
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

  const handleOpenCreateModal = async () => {
    const check = await requestChekLogin();
    if (check) {
      setShowCreateModal(true);
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleOpenCodeModal = () => {
    setShowCodeModal(true);
  };

  const handleCloseCodeModal = () => {
    setShowCodeModal(false);
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
            onClick={() => console.log('참여한 학습 공간 클릭됨')}
          >
            참여한 학습 공간
          </div>
          {/* <div style={{ color: '#ccc', fontWeight: 'bold' }}>|</div>
          <div
            className="textItem"
            onClick={() => console.log('내 학습 공간 클릭됨')}
          >
            내 학습 공간
          </div> */}
        </div>
        <div className="uiRight">
          <button className="codeButton" onClick={handleOpenCodeModal}>
            코드로 입장
          </button>
          <button className="createButton" onClick={handleOpenCreateModal}>
            학습 공간 만들기
          </button>
        </div>
      </div>
      {spaceList.length > 0 ? (
        <>
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
                        <span className="count-text">
                          {space.membersCount}명
                        </span>
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
            pageRangeDisplayed={pageRangeDisplayed} // 동적으로 설정된 페이지 버튼 수
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      ) : (
        <>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </>
      )}

      {selectedSpace && (
        <EnterSpaceModal
          show={showModal}
          handleClose={handleCloseModal}
          space={selectedSpace}
        />
      )}

      <CreateSpaceModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
      />
      <InviteCodeModal
        show={showCodeModal}
        handleClose={handleCloseCodeModal}
      />
    </>
  );
};

export default ListUserSpace;
