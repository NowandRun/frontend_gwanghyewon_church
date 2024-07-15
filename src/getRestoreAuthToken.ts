import { makeVar } from '@apollo/client';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from './constants';

async function getRestoreAuthToken(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> {
  try {
    const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESSTOKEN);
    const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESHTOKEN);

    if (!accessToken || !refreshToken) {
      // accessToken 또는 refreshToken이 없는 경우에 대한 처리
      return { accessToken: null, refreshToken: null };
    }
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Failed to restore auth tokens:', error);
    // 에러 처리
    return { accessToken: null, refreshToken: null };
  }
}

export { getRestoreAuthToken };
