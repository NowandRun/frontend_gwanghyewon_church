import React from 'react';
import { LoggedOutRouter } from './routers/logged-out-router';
import { LoggedInRouter } from './routers/logged-in-router';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAcessTokenVar, isLoggedInRefresTokenVar } from './apollo';

export const App = () => {
  const isLoggedInAceessToken = useReactiveVar(isLoggedInAcessTokenVar);
  const isLoggedInRefreshToken = useReactiveVar(isLoggedInRefresTokenVar);

  const isLoggedIn = isLoggedInAceessToken && isLoggedInRefreshToken;

  /* 데이터가 없거나 로딩중이거나 에러가 있으면 if문 진행 */

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
