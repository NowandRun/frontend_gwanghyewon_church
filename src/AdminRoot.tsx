// src/AdminRoot.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import AdminHeader from './components/AdminComponents/AdminSidebar';

const AdminRoot = () => {
  return (
    <AdminLayout>
      <AdminHeader />

      <AdminMain>
        <PageHeader>
          <h1>관리자 대시보드</h1>
          <span>게시판 관리</span>
        </PageHeader>

        <AdminContent>
          <ContentCard>
            <Outlet />
          </ContentCard>
        </AdminContent>
      </AdminMain>
    </AdminLayout>
  );
};

export default AdminRoot;
const AdminLayout = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bgColor || '#f4f6fb'};
  display: flex;
  flex-direction: column;
`;

const AdminMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  padding: 24px 40px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;

  h1 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
  }

  span {
    font-size: 0.85rem;
    color: #6b7280;
  }
`;

const AdminContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

const ContentCard = styled.section`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  min-height: 100%;
`;
