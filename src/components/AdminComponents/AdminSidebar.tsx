import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // 👈 Link 추가
import styled from 'styled-components';
import { useMe } from '../../hooks/useMe';

const AdminHeader: React.FC = () => {
  const { data, loading } = useMe();

  if (loading || !data) return null;

  return (
    <HeaderWrapper>
      <LeftSection>
        <Logo>광혜원순복음교회 관리자 사이트</Logo>

        <NavList>
          <NavItem to="/admin/church-info">교회소식</NavItem>
          <NavItem to="/admin/church-album">교우동정</NavItem>
          <NavItem to="/admin/church-bulletin">교회주보</NavItem>
          <NavItem to="/admin/main-popup">메인팝업</NavItem>
          {(data.me.role === 'Admin' || data.me.role === 'Client') && (
            <NavItem to="/admin/users">사용자 관리</NavItem>
          )}

          {data.me.role === 'Client' && <NavItem to="/admin/logs">시스템 로그</NavItem>}
        </NavList>
      </LeftSection>

      {/* 📌 Link 컴포넌트로 감싸 클릭 시 /admin/admin-board 로 이동 */}
      <UserInfo to="/admin/admin-board">
        <strong>{data.me.userId}</strong>
        <Role>{data.me.userName}</Role>
      </UserInfo>
    </HeaderWrapper>
  );
};

export default AdminHeader;

const HeaderWrapper = styled.header`
  width: 100%;
  height: 70px;
  background-color: red;
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 40px;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const Logo = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  white-space: nowrap;
`;

const NavList = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled(NavLink)`
  padding: 8px 14px;
  color: #ccc;
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 6px;

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

// 📌 styled.div -> styled(Link)로 변경 및 호버 스타일 적용
const UserInfo = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-decoration: none;
  color: inherit;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #2a2a40;

    strong {
      color: #3b82f6; /* 마우스 올렸을 때 강조 효과 (선택사항) */
    }
  }
`;

const Role = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
`;
