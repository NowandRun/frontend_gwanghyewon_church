import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { menuItems } from '../../Navicaton';
import { PushPinIcon as PushPin } from '@phosphor-icons/react/dist/ssr';
import { motion } from 'framer-motion';

const SubPageNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
            custom={index}
            variants={linkVariants}
            initial="hidden"
            animate="visible"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
              navigate(`/${currentMenu.path}${child.path ? `/${child.path}` : ''}`, {
                replace: false,
              });
              window.scrollTo(0, 0);
            }}
          >
            <NavLink
              to={`/${currentMenu.path}${child.path ? `/${child.path}` : ''}`}
              end={child.path === ''}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <StyledPushPinIcon />
              {child.label}
            </NavLink>
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
  position: sticky;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 16vw;
  border: 1px solid #ccc;
  border-radius: 6px;

  ${({ theme }) => theme.media.tablet} {
    left: 1%;
    width: 25vw;
    margin-top: 2vw;
  }

  ${({ theme }) => theme.media.mobile} {
    /* ✅ 블럭처럼 아래 요소와 겹치지 않도록 */
    width: 100%;
    border: none;
    border-radius: 0;
    margin: 0;
    padding: 0;
    left: 0;
  }
`;

const SubPageNavTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
    font-size: 3vw;
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

  ${({ theme }) => theme.media.mobile} {
    padding-top: 0.5vw;
    font-size: 2.3vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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

    ${({ theme }) => theme.media.mobile} {
      padding: 1.5vw;
    }

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

const MotionNavLink = styled(motion.div)`
  padding: 0.25vw;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;

  ${({ theme }) => theme.media.mobile} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1vw;
  }
`;

const StyledPushPinIcon = styled(PushPin)`
  margin-right: 0.5rem; // 아이콘 오른쪽 여백
  ${({ theme }) => theme.media.mobile} {
    margin-right: 0;
  }
`;
