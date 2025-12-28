import { makeVar, useReactiveVar } from '@apollo/client';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useMe } from '../../hooks/useMe';

const SidebarWrapper = styled.aside`
  width: 240px;
  background-color: #1e1e2f;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  min-height: 100vh;
`;

const SidebarTitle = styled.h2`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(NavLink)`
  padding: 12px 20px;
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;

  &.active {
    background-color: #2e2e4e;
    color: #fff;
    font-weight: 600;
  }

  &:hover {
    background-color: #2a2a40;
    color: #fff;
  }
`;

const AdminSidebar: React.FC = () => {
  const { data, loading } = useMe();

  if (loading || !data) return null;

  return (
    <SidebarWrapper>
      <SidebarTitle>Admin Panel</SidebarTitle>

      <UserInfo>
        <strong>{data.me.userId}</strong>
        <Role>{data.me.role}</Role>
      </UserInfo>

      <NavList>
        <NavItem to="/admin/dashboard">대시보드</NavItem>

        {(data.me.role === 'Admin' || data.me.role === 'Client') && (
          <NavItem to="/admin/users">사용자 관리</NavItem>
        )}

        {data.me.role === 'Client' && <NavItem to="/admin/logs">시스템 로그</NavItem>}
      </NavList>
    </SidebarWrapper>
  );
};

export default AdminSidebar;

const UserInfo = styled.div`
  padding: 0 20px 16px;
  border-bottom: 1px solid #2e2e4e;
  margin-bottom: 12px;
`;

const Role = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 4px;
`;
