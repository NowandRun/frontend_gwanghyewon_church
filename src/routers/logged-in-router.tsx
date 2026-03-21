import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../hooks/useMe';

const LoggedInRouter = () => {
  const { data, loading, error } = useMe(); // error 추가

  if (loading) {
    return <div>Loading...</div>;
  }

  // ⭐ 에러가 발생했거나(토큰 없음/만료), 데이터에 유저 정보가 없으면 로그인으로 리다이렉트
  if (error || !data?.me) {
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
