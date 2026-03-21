import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAccessTokenVar } from '../types/apollo';
import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRouter = () => {
  const isLoggedIn = useReactiveVar(isLoggedInAccessTokenVar);

  if (isLoggedIn) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicOnlyRouter;
