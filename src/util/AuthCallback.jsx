import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  // 개발 환경에서 테스트 할 경우 React 18 이상 버전에선 useEffect가 2번 호출되는 버그가 존재함
  // 해당 버그는 프로덕션 환경에선 발생되지 않는다고 하며, 엑세스 토큰이 없다는 에러로그가 떠도 작동 자체는 정상적으로 이루어짐
  // 개발 환경에서 Strict Mode를 비활성화 하는 방법도 있으나 React 18버전의 특정 기능을 사용하는 경우 비활성화 하지 않는 것이 좋음
  // useEffect 훅 내부에서 상태를 관리하는 방법도 있으나 크게 의미가 없음
  // useRef를 사용하는 방법도 있지만 useEffect가 딱 한번만 실행될 수 있으며, 첫 번째 실행 이후엔 더 이상 실행이 불가능함 (로그아웃 후 재로그인이 불가)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const provider = urlParams.get('provider'); // 'kakao' 또는 'google'

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);

      if (provider === 'kakao') {
        console.log('카카오 로그인 성공');
      } else if (provider === 'google') {
        console.log('구글 로그인 성공');
      }

      // navigate('/')를 두 번 호출해도 문제가 없도록 리디렉션 처리
      navigate('/');
    } else {
      // 오류 처리 로직 추가 (예: 로그인 실패 메시지 표시)
      console.error('액세스 토큰이 없습니다.');
    }
  }, [navigate]);

  return <div>로그인 중입니다...</div>;
};

export default AuthCallback;
