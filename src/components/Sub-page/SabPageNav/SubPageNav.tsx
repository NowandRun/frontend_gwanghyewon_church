import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { menuItems } from '../../Navicaton';
import { PushPinIcon as PushPin } from '@phosphor-icons/react/dist/ssr';
import { motion } from 'framer-motion';

const SubPageNav = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1]; // 첫 번째 경로 segment
  const currentMenu = menuItems.find((item) => item.path === currentPath);

  if (!currentMenu) return null; // 현재 path가 메뉴에 없으면 아무것도 렌더링 안함

  return (
    <SubPageNavWrapper>
      <SubPageNavTitleWrapper>
        <SubPageNavTitle>{currentMenu.label}</SubPageNavTitle>
      </SubPageNavTitleWrapper>
      <ChildLinkWrapper>
        {currentMenu.children.map((child, index) => (
          <MotionNavLink
            key={child.path || 'root'}
            to={`/${currentMenu.path}${child.path ? `/${child.path}` : ''}`}
            end={child.path === ''}
            className={({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')}
            custom={index}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
          >
            <StyledPushPinIcon />
            {child.label}
          </MotionNavLink>
        ))}
      </ChildLinkWrapper>
    </SubPageNavWrapper>
  );
};

export default SubPageNav;

// 🔹 애니메이션 정의
const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1, // 순차적으로 등장
      duration: 0.3,
    },
  }),
};

const SubPageNavWrapper = styled.nav`
  position: sticky; /* ✅ sticky로 변경 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 15%;
  top: 60vh;
  width: 16vw;
  border: 1px solid #ccc;
  border-radius: 6px;
  ${({ theme }) => theme.media.tablet} {
    left: 1%;
    top: 30%;
    width: 25vw;
  }
  ${({ theme }) => theme.media.mobile} {
    position: none;
    display: none;
  }
`;

const SubPageNavTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid #ccc;

  height: 3vw; /* 예: 60px 고정 */
  padding: 2vw 0;
  ${({ theme }) => theme.media.tablet} {
    height: 4vw; /* 예: 60px 고정 */
    padding: 3vw 0;
  }
`;

const SubPageNavTitle = styled.span`
  font-size: 1.5vw;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2.5vw;
  }
`;

const ChildLinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1vw;
  transition:
    color 0s,
    background-color 0s !important;
  text-decoration: none;
  color: #444;
  font-weight: 500;
  width: 100%;
  padding: 1rem;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
    padding: 0.5rem;
  }

  a {
    transition:
      color 0s,
      background-color 0s !important;
    padding: 0.25vw;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 0.5rem; // 아이콘과 텍스트 간격
    &.active {
      transition:
        color 0s,
        background-color 0s !important;
      background-color: ${(props) => props.theme.cardBgColor};
      color: white;
    }

    &:hover {
      transition:
        color 0s,
        background-color 0s !important;
      background: ${({ theme }) => theme.cardBgColor}33;
    }
  }
`;

const MotionNavLink = styled(motion(NavLink))`
  padding: 0.25vw;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StyledPushPinIcon = styled(PushPin)`
  margin-right: 0.5rem; // 아이콘 오른쪽 여백
`;
