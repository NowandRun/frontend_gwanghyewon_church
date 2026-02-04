// src/routers/AdminIdleGuard.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminIdleLogout } from '../hooks/useAdminIdleLogout';
import styled from 'styled-components';
import { useMe } from '../hooks/useMe';

const AdminIdleGuard = () => {
  const { data } = useMe();
  const { remainSeconds, showWarning } = useAdminIdleLogout(!!data);

  return (
    <>
      {showWarning && (
        <IdleBanner>
          ⏳ 자동 로그아웃까지 <strong>{remainSeconds}</strong>초
        </IdleBanner>
      )}
      <Outlet />
    </>
  );
};

export default AdminIdleGuard;

const IdleBanner = styled.div`
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 9999;

  padding: 0.6rem 1rem;
  border-radius: 12px;

  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;

  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.35);

  animation: fadeIn 0.3s ease;

  strong {
    font-size: 1.05rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
