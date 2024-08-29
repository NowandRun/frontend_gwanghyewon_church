import { LOCALSTORAGE_ACCESSTOKEN } from './constants';

async function getRestoreAuthToken(): Promise<{
  accessToken: string | null;
}> {
  try {
    const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESSTOKEN);
    if (!accessToken) {
      // accessToken 또는 refreshToken이 없는 경우에 대한 처리
      return { accessToken: null };
    }
    return { accessToken };
  } catch (error) {
    console.error('Failed to restore auth tokens:', error);
    // 에러 처리
    return { accessToken: null };
  }
}

export { getRestoreAuthToken };
