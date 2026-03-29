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
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message, extensions } = err;

      // 1. 세션 만료 에러만 리다이렉트
      if (message === 'jwt expired' || extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        authTokenVar('');
        isLoggedInAccessTokenVar(false);
        sessionStorage.setItem('authError', 'token-expired');

        // 새로고침 없이 hash만 바꿔서 즉시 로그인 페이지로 보냄
        window.location.hash = '/admin/login';
        return;
      }

      // 2. Context creation failed는 서버 에러로 간주 (로그아웃 시키지 않음)
      if (message.includes('Context creation failed')) {
        console.error('서버 컨텍스트 생성 실패: 서버 점검이 필요할 수 있습니다.');
        return;
      }
    }
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
