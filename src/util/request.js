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
  localStorage.removeItem('access_token');
  try {
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        // withCredentials: true,
      },
    );
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
    const accessToken = localStorage.getItem('access_token') || null;
    const response = await axios.get(`${process.env.VITE_SERVER_URL}/space`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // console.log('학습공간 목록 전체 조회 성공', response.data);
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('학습공간 목록 전체 조회 실패', error);
    return [];
  }
};

export const requestUserSpaceList = async () => {
  try {
    const accessToken = localStorage.getItem('access_token') || null;
    if (!accessToken) {
      return [];
    }
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
  }
};

export const requestEnterSpace = async (data) => {
  try {
    // console.log(data);
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
  }
};

export const requestCheckSpace = async (url) => {
  try {
    // console.log(url);
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
  }
};

//  닉네임 변경
export const requestChangeNickName = async (data) => {
  try {
    // { nickName }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    const response = await axios.patch(
      `${process.env.VITE_SERVER_URL}/user/nick`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('Error changing nickname:', error);
    return false;
  }
};

// 옷 변경
export const requestChangeSkin = async (data) => {
  try {
    // { 'skin', 'hair', 'face', 'clothes', 'hair_color', 'clothes_color'  }
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    const response = await axios.patch(
      `${process.env.VITE_SERVER_URL}/user`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('Error changing skin:', error);
    return false;
  }
};

// 입장 코드 생성
export const requestCreateCode = async (spaceId) => {
  // data = { email, password };
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(
      `${process.env.VITE_SERVER_URL}/space/invitation/${spaceId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return response;
  } catch (error) {
    console.error('Error create invite code', error);
  }
};

// 입장 코드 입력
export const requestEnterCode = async (code) => {
  try {
    const data = { code: code };
    if (code.length != 6) throw new Error('code length');
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/space/invitation/check`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response.data; // 응답 데이터만 반환
  } catch (error) {
    console.error('Error changing skin:', error);
    return false;
  }
};

export const requestSignupSpace = async (spaceId) => {
  const data = { spaceId };
  try {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/space-member`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response;
  } catch (error) {
    console.error('멤버 가입 실패:', error);
    return false;
  }
};

// 스페이스 생성 (이미지)
export const requestCreateSpace = async (spaceData) => {
  const accessToken = localStorage.getItem('access_token');

  // FormData 객체 생성
  const formData = new FormData();
  formData.append('name', spaceData.name);
  formData.append('content', spaceData.content);
  formData.append('password', spaceData.password || ''); // 공개 스페이스의 경우 빈 문자열
  if (spaceData.image) {
    formData.append('image', spaceData.image);
  }

  try {
    const response = await axios.post(
      `${process.env.VITE_SERVER_URL}/space`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data; // 생성된 스페이스 정보 반환
  } catch (error) {
    console.error('스페이스 생성 실패:', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

// 소셜로그인
export const handleKakaoLogin = () => {
  window.location.href = `${process.env.VITE_SERVER_URL}/auth/kakao`;
};

export const handleGoogleLogin = () => {
  window.location.href = `${process.env.VITE_SERVER_URL}/auth/google`;
};
