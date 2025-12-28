// src/AdminRoot.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminComponents/Admin.Sidebar';
import styled from 'styled-components';

const AdminRoot = () => {
  // ✅ 로그인 상태 확인 (로그아웃이면 접근 불가)

  return (
    <AdminLayout>
      <AdminSidebar />
      <AdminContent>
        <Outlet /> {/* ✅ 하위 admin route들 렌더링 */}
      </AdminContent>
    </AdminLayout>
  );
};

export default AdminRoot;

// ✅ styled-components
const AdminLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.bgColor || '#f5f6fa'};
`;

const AdminContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;
