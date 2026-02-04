import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '../hooks/useMe';

const LoggedInRouter = () => {
  const { data, loading } = useMe();

  // 2️⃣ 인증은 됐지만 유저 정보 로딩 중
  if (loading) {
    return <div>Loading...</div>;
  }

  // 3️⃣ 토큰은 있지만 유저 없음 → 비정상
  if (!data?.me) {
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
