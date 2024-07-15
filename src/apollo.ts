// reactive variable과 link의 개념
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable,
  createHttpLink,
  makeVar,
} from '@apollo/client';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from './constants';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getRestoreAuthToken } from './getRestoreAuthToken';
import { logout } from './logout';

const aatoken = localStorage.getItem(LOCALSTORAGE_ACCESSTOKEN);
const artoken = localStorage.getItem(LOCALSTORAGE_REFRESHTOKEN);

// reactive variable
export const isLoggedInAccessTokenVar = makeVar(Boolean(aatoken));
export const isLoggedInRefreshTokenVar = makeVar(Boolean(artoken));
export const accessAuthToken = makeVar(aatoken);
export const refreshAuthToken = makeVar(artoken);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  console.log(graphQLErrors);
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === 'UNAUTHENTICATED') {
        return new Observable((observer) => {
          console.log('🍪', observer);
          void getRestoreAuthToken()
            .then((response) => {
              const newAccessToken = response?.accessToken;
              const newRefreshToken = response?.refreshToken;

              if (!newAccessToken || !newRefreshToken) return;

              operation.setContext({
                headers: {
                  ...operation.getContext().headers,
                  'access-jwt': newAccessToken,
                  'refresh-jwt': newRefreshToken,
                },
              });

              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            })
            .catch(async (err) => {
              console.log(`err`, err);
              await logout();
            });
        });
      }
    }
  }
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'access-jwt': accessAuthToken() || '',
      'refresh-jwt': refreshAuthToken() || '',
    },
  };
});

export const client = new ApolloClient({
  /* authLink.concat을 활용하여 여러 Link를 사용하는 방법 */
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return {
                isLoggedInAccessTokenVar: isLoggedInAccessTokenVar(),
                isLoggedInRefreshTokenVar: isLoggedInRefreshTokenVar(),
              };
            },
          },
          token: {
            read() {
              return {
                accessToken: accessAuthToken(),
                refreshToken: refreshAuthToken(),
              };
            },
          },
        },
      },
    },
  }),
});
