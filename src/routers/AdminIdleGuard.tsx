// src/routers/AdminIdleGuard.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminIdleLogout } from '../hooks/useAdminIdleLogout';
import { useMe } from '../hooks/useMe';

const AdminIdleGuard = () => {
  const { data } = useMe();

  // ✅ admin 영역에 "들어와 있고 + 로그인 상태"일 때만 감시
  useAdminIdleLogout(!!data);

  return <Outlet />;
};

export default AdminIdleGuard;
