import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import { useReactiveVar } from '@apollo/client';
import { authErrorReasonVar } from '../types/apollo';

const LoggedInRouter = () => {
  const { data, loading } = useMe();
  const authErrorReason = useReactiveVar(authErrorReasonVar);

  // 🔥 로그아웃 사유 발생 시 즉시 이동
  if (authErrorReason) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default LoggedInRouter;
