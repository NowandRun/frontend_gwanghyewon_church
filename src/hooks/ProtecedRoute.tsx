import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAccessTokenVar } from '../types/apollo';

export function ProtectedRoute() {
  const isLoggedIn = useReactiveVar(isLoggedInAccessTokenVar);

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}
