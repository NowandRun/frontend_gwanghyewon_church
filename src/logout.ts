import {
  accessAuthToken,
  isLoggedInAccessTokenVar,
  isLoggedInRefreshTokenVar,
  refreshAuthToken,
} from './apollo';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from './constants';

export async function logout() {
  try {
    localStorage.removeItem(LOCALSTORAGE_ACCESSTOKEN);
    localStorage.removeItem(LOCALSTORAGE_REFRESHTOKEN);

    isLoggedInAccessTokenVar(false);
    isLoggedInRefreshTokenVar(false);
    accessAuthToken(null);
    refreshAuthToken(null);
  } catch (error) {
    console.error(error);
  }
}
