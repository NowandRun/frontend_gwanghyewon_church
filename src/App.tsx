import React from 'react';
import { LoggedOutRouter } from './routers/logged-out-router';
import { LoggedInRouter } from './routers/logged-in-router';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAcessTokenVar } from './apollo';

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInAcessTokenVar);

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};
