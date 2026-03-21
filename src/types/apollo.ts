// reactive variable과 link의 개념
import { ApolloClient, InMemoryCache, createHttpLink, from, makeVar, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_TOKEN } from './constants';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInAccessTokenVar = makeVar(Boolean(token)); // 초기값은 false로 설정

export const authTokenVar = makeVar(token);

// Apollo Subscription을 사용하기 위한 웹소켓 통신
const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === 'production'
        ? 'wss://web-restaurants-backend-78a7ec1afcae.herokuapp.com/graphql'
        : 'ws://localhost:4000/graphql',
    connectionParams: {
      'x-jwt': authTokenVar() || '',
    },
  }),
);

/* 'https://wavenexus.co.kr/graphql', */
/* 'http://localhost:4000/graphql' */
const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://web-restaurants-backend-78a7ec1afcae.herokuapp.com/graphql'
      : 'http://localhost:4000/graphql',
});

// link는 연결할 수 있는 것들을 말함(http, auth, web sockets 링크)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  };
});

// apollo.ts 파일 수정
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const message = err.message;
      // 에러 코드 확인 (extensions.code)
      const code = err.extensions?.code;

      // jwt 만료뿐만 아니라, 인증되지 않은 모든 접근에 대해 처리
      if (
        message === 'jwt expired' ||
        code === 'UNAUTHENTICATED' ||
        message.includes('Context creation failed') // 서버 설정에 따라 다를 수 있음
      ) {
        // 1. 상태 초기화
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        authTokenVar('');
        isLoggedInAccessTokenVar(false);

        // 2. 강제 리프레시 또는 이동 (흰 화면 탈출)
        // Reactive Variable만 바꿔서 화면이 안 바뀐다면 강제로 홈으로 보냅니다.
        window.location.href = '/';

        sessionStorage.setItem('authError', 'token-expired');
      }
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

// websoket과 http link 연결시 사용하기 위한 기준
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link: from([errorLink, splitLink]),
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
              return authTokenVar();
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
console.log(client);
