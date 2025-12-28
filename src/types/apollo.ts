// reactive variable과 link의 개념
import { ApolloClient, InMemoryCache, createHttpLink, from, makeVar, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { LOCALSTORAGE_TOKEN } from './constants';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { AuthErrorReason, ServerAuthReason } from './types';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

export const isLoggedInAccessTokenVar = makeVar(Boolean(token)); // 초기값은 false로 설정

export const authTokenVar = makeVar(token);

export const authErrorReasonVar = makeVar<AuthErrorReason>(null);

// Apollo Subscription을 사용하기 위한 웹소켓 통신
const wsLink = new GraphQLWsLink(
  createClient({
    url:
      process.env.NODE_ENV === 'production'
        ? 'wss://web-restaurants-backend-78a7ec1afcae.herokuapp.com/graphql'
        : 'ws://localhost:4000/graphql',
    connectionParams: () => ({
      'x-jwt': authTokenVar() || '',
    }),
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

// websoket과 http link 연결시 사용하기 위한 기준
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);
const errorLink = onError(({ graphQLErrors }) => {
  if (!graphQLErrors) return;

  for (const error of graphQLErrors) {
    if (error.extensions?.code !== 'UNAUTHENTICATED') continue;

    // 1️⃣ 서버 reason → 클라이언트 reason 매핑
    const serverReason = error.extensions?.reason as ServerAuthReason | undefined;

    let clientReason: AuthErrorReason = 'INVALID';

    switch (serverReason) {
      case 'TOKEN_EXPIRED':
        clientReason = 'EXPIRED';
        break;

      case 'IDLE_TIMEOUT':
        clientReason = 'IDLE_TIMEOUT';
        break;

      case 'FORCE_LOGOUT':
        clientReason = 'FORCE_LOGOUT';
        break;
    }

    // 2️⃣ 이미 reason이 있으면 덮어쓰지 마라 ⭐
    if (!authErrorReasonVar()) {
      authErrorReasonVar(clientReason);
      localStorage.setItem('LAST_LOGOUT_REASON', clientReason);
    }

    // 3️⃣ 로그아웃 (단 한 번)
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInAccessTokenVar(false);

    return; // ⭐ 여기서 종료 (중요)
  }
});

const link = from([errorLink, splitLink]);

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link,
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
