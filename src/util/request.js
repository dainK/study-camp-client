import axios from 'axios';

export const requestChekLogin = async (data) => {
  try {
    return false;
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return false;
    return false;
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

export const requestLogin = async (data) => {
  // data = { email, password };
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/auth/login`,
      data,
    );
    console.log('로그인 성공:', response.data);

    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);

    return response;
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

export const requestLogout = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(
      `${import.meta.env.SERVER_URL}/auth/logout`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    localStorage.removeItem('access_token');
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
  }
};

export const requestSignup = async (data) => {
  // data = { email, password, passwordConfirm, nick_name };
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/user`,
      data,
    );
    console.log('회원가입 성공:', response.data);
    return response;
  } catch (error) {
    console.error('회원가입 실패:', error);
  }
};

export const requestUserProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
  }
};

export const requestAllSpaceList = async () => {
  try {
    // const accessToken = localStorage.getItem('access_token');
    // console.log(import.meta.env.VITE_SERVER_URL);
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/space`,
    );
    // console.log('학습공간 목록 전체 조회 성공', response.data);
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('학습공간 목록 전체 조회 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};
