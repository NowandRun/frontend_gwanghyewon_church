import React, { useEffect } from 'react';
import { LoggedOutRouter } from './routers/logged-out-router';
import { LoggedInRouter } from './routers/logged-in-router';
import { useMe } from './hooks/useMe';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { isLoggedInAcessTokenVar, isLoggedInRefresTokenVar } from './apollo';

export const App = () => {
  const isLoggedInAceessToken = useReactiveVar(isLoggedInAcessTokenVar);
  const isLoggedInRefreshToken = useReactiveVar(isLoggedInRefresTokenVar);
  const isLoggedIn = isLoggedInAceessToken && isLoggedInRefreshToken;

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
