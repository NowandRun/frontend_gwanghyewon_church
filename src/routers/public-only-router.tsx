// routers/public-only-router.tsx
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInAccessTokenVar } from '../types/apollo';
import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRouter = () => {
  const isLoggedIn = useReactiveVar(isLoggedInAccessTokenVar);

  // 🔐 이미 로그인 → 관리자 대시보드로
  if (isLoggedIn) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  // ❌ 비로그인 → 정상 접근 허용
  return <Outlet />;
};

export default PublicOnlyRouter;
