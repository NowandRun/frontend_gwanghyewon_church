// reactive variable과 link의 개념
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from './constants';

export const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESSTOKEN);
export const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESHTOKEN);

export const isLoggedInAcessTokenVar = makeVar(Boolean(accessToken)); // 초기값은 false로 설정
export const isLoggedInRefresTokenVar = makeVar(Boolean(refreshToken)); // 초기값은 false로 설정

export const authAccessToken = makeVar(accessToken);
export const authRefreshToken = makeVar(refreshToken);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      aat: authAccessToken() || '',
      art: authRefreshToken() || '',
    },
  };
});

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return {
                isLoggedInAcessTokenVar: isLoggedInAcessTokenVar(),
                isLoggedInRefresTokenVar: isLoggedInRefresTokenVar(),
              };
            },
          },
          token: {
            read() {
              return {
                accessToken: authAccessToken(),
                refresToken: authRefreshToken(),
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
  },
});
