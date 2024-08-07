import axios from 'axios';

export const requestChekLogin = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return null;
  try {
    const response = await axios.get(
      `${process.env.VITE_SERVER_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    if (accessToken) localStorage.removeItem('access_token');
    return null;
  }
};

export const requestLogin = async (data) => {
  // data = { email, password };
  try {
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/auth/login`,
      data,
    );
    // console.log('로그인 성공:', response.data);

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
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/auth/logout`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    localStorage.removeItem('access_token');
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    if (accessToken) {
      localStorage.removeItem('access_token');
    }
  }
};

export const requestSignup = async (data) => {
  // data = { email, password, passwordConfirm, nick_name };
  try {
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/user`,
      data,
    );
    // console.log('회원가입 성공:', response.data);
    return response;
  } catch (error) {
    console.error('회원가입 실패:', error);
  }
};

export const requestUserProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(
      `${process.env.VITE_SERVER_URL}/user/profile`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
  }
};

export const requestAllSpaceList = async () => {
  try {
    const response = await axios.get(`${process.env.VITE_SERVER_URL}/space`);
    // console.log('학습공간 목록 전체 조회 성공', response.data);
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('학습공간 목록 전체 조회 실패', error);
    return [];
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

export const requestUserSpaceList = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(
      `${process.env.VITE_SERVER_URL}/space-member/user`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    return [];
    console.error('유저 학습공간 목록 전체 조회 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

export const requestEnterSpace = async (data) => {
  try {
    console.log(data);
    //{spaceId,password}
    const accessToken = localStorage.getItem('access_token') || null;
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/space/enter`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    return false;
    console.error('입장실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

export const requestCheckSpace = async (url) => {
  try {
    console.log(url);
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(
      `${process.env.VITE_SERVER_URL}/space/url/${url}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    return false;
    console.error('입장실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};
