import React from 'react';
import { LoggedOutRouter } from './routers/logged-out-router';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAccessTokenVar, isLoggedInRefreshTokenVar } from './apollo';
import { LoggedInRouter } from './routers/logged-in-router';

export const App = () => {
  const isLoggedInAccessToken = useReactiveVar(isLoggedInAccessTokenVar);
  console.log(isLoggedInAccessToken);
  const isLoggedInRefreshToken = useReactiveVar(isLoggedInRefreshTokenVar);

  const isLoggedIn = isLoggedInAccessToken && isLoggedInRefreshToken;
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
