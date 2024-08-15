// reactive variable과 link의 개념
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_ACCESSTOKEN } from './constants';

const GRAPHQL_URI = process.env.REACT_APP_GRAPHQL_URI;
export const accessToken = localStorage.getItem(LOCALSTORAGE_ACCESSTOKEN);

export const isLoggedInAccessTokenVar = makeVar(Boolean(accessToken)); // 초기값은 false로 설정

export const authAccessToken = makeVar(accessToken);

const httpLink = createHttpLink({
  uri: 'https://wavenexus.co.kr/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      aat: authAccessToken() || '',
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
                isLoggedInAcessTokenVar: isLoggedInAccessTokenVar(),
              };
            },
          },
          token: {
            read() {
              return {
                accessToken: authAccessToken(),
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
