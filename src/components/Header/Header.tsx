import React, { useEffect, useRef, useState } from 'react';
import Mode from './DarkMode';
import styled from 'styled-components';
import Sitemap from './Sitemap';
import { Link, useLocation } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';

function Header() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null); // hover 상태 추가
  const [isHovering, setIsHovering] = useState(false); // Hover 상태 유지
  const [isHeaderHovering, setIsHeaderHovering] = useState(false);
  // 메뉴 항목의 경로
  const menuItems = [
    { path: '/info', label: '교회안내', layoutId: 'positionbar' },
    { path: '/ministro', label: '섬기는 이들' },
    { path: '/sermon', label: '설교' },
    { path: '/youth', label: '다음세대' },
    { path: '/group', label: '교육 소그룹' },
    { path: '/missionary', label: '전도 선교' },
    { path: '/news', label: '교회소식' },
  ];

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) => item.path === location.pathname
    );
    setActiveIndex(currentIndex !== -1 ? currentIndex : 0);
  }, [location.pathname]);

  return (
    <AllContents>
      <HeaderWrapper>
        <Link to='/'>
          <Logo>
            <span>교회로고</span>
          </Logo>
        </Link>
        <SubPage
          onMouseEnter={() => {
            setIsHeaderHovering(true); // HoverBox 표시}
          }}
          onMouseLeave={() => {
            setIsHeaderHovering(false); // HoverBox 숨김
          }}
        >
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <SubPageItem
                onMouseEnter={() => {
                  setHoverIndex(index);
                  setIsHovering(true); // HoverBox 표시}
                }}
                onMouseLeave={() => {
                  setHoverIndex(null);
                  setIsHovering(true); // HoverBox 표시}
                }}
              >
                <div style={{ margin: '20px' }}>
                  {item.label}
                  {(activeIndex === index || hoverIndex === index) && (
                    <Positionbar layoutId='pointerbar' />
                  )}
                </div>
              </SubPageItem>
            </Link>
          ))}
        </SubPage>
        <UserFeat>
          <span>회원가입</span>
          <span>로그인</span>
          <ModeWrapper>
            <Mode />
          </ModeWrapper>
        </UserFeat>
        <div>
          <SitemapWrapper>
            <Sitemap />
          </SitemapWrapper>
        </div>
      </HeaderWrapper>
      <hr />
      {menuItems.map(
        (item, index) =>
          hoverIndex === index && (
            /* HoverBox 상태를 isHovering에 따라 결정 */
            <HoverBox
              onMouseEnter={() => {
                setHoverIndex(index);
              }}
              onMouseLeave={() => {
                setHoverIndex(null);
              }}
              key={index}
            >
              {index}
            </HoverBox>
          )
      )}
    </AllContents>
  );
}

export default Header;

const AllContents = styled.header`
  position: relative; /* 다른 컴포넌트와의 상대 위치를 설정 */
  transition: 1s; /* 이 부분은 기본 상태에서의 전환 속도 */
  /* 화면 크기가 1300px 이상일 때만 hover 효과 적용 */
  @media (min-width: 1300px) {
    &:hover {
      color: black;
      background-color: white;
    }
  }
  @media (max-width: 1300px) {
    background-color: ${(props) => props.theme.cardBgColor};
  }
`;

const HeaderWrapper = styled.div`
  position: relative; /* 절대 위치로 설정하여 다른 내용에 영향 미치지 않도록 함 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px; /* 2xl screen size */
  margin-left: auto;
  margin-right: auto;
  height: 120px; /* 고정된 높이 */
  @media (max-width: 1300px) {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  font-size: 40px;
  @media (max-width: 1300px) {
    transition: 1s;
    font-size: 15px;
  }
`;

const SubPage = styled.div`
  font-size: 20px;
  font-weight: bold;
  height: 100%;
  align-items: stretch; /* stretch로 변경하여 자식 요소가 전체 높이를 차지하도록 함 */
  display: flex;
  /* 작은 화면에서는 숨기기 */
  @media (max-width: 1300px) {
    display: none;
  }
`;

const UserFeat = styled.div`
  font-size: 15px;
  display: flex;
  position: relative; /* Positionbar가 텍스트 아래에 맞게 위치할 수 있도록 설정 */
  align-items: center;
  justify-content: center;
  span:not(:last-child) {
    margin-right: 15px;
    border-right: 1px solid #ccc; /* 여기에 경계선 추가 */
    padding-right: 10px; /* 경계선과 텍스트 간의 여백 */
  }
  margin-right: 5%;

  /* 작은 화면에서는 '회원가입'과 '로그인' 숨기기 */
  @media (max-width: 1300px) {
    width: 100%;
    display: flex;
    margin-right: 0;
    justify-content: space-between;
    justify-content: flex-end;
    span:not(:last-child) {
      display: none;
    }
  }
`;

const ModeWrapper = styled.div`
  @media (max-width: 1300px) {
    margin-right: 10px; /* 여유 공간 확보 */
  }
`;

const SitemapWrapper = styled.div`
  position: absolute;
  bottom: -20px; /* hr 위에 겹쳐서 보이도록 아래로 배치 */
  right: 0;
  display: flex;
  justify-content: center;
  top: 0;
  @media (max-width: 1300px) {
    position: relative;
  }
`;

const SubPageItem = styled.div`
  flex-grow: 1; /* 각 항목이 동일한 너비를 차지하도록 설정 */
  width: auto;
  position: relative; /* Positionbar가 텍스트 아래에 맞게 위치할 수 있도록 설정 */
  align-items: center; /* 텍스트를 수직 및 수평으로 중앙 정렬 */
  justify-content: center; /* Center the label text */
  height: 100%; /* 높이를 100%로 설정 */
  display: flex; /* 인라인 블록으로 설정 */
  flex: 1; /* 각 항목이 동일한 너비를 가지도록 설정 */
  flex-grow: 1; /* Ensure each item takes equal space */
  text-align: center; /* 텍스트를 중앙 정렬 */
  bottom: 0;
  cursor: pointer; /* 포인터 커서 추가 */
`;

const Positionbar = styled(motion.span)`
  position: absolute;
  width: 100%; /* 위치 막대의 너비를 항목의 너비에 맞추기 위해 100%로 설정 */
  height: 3px;
  bottom: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.cardBgColor};
  transition: left 0.3s ease; /* 애니메이션 효과 추가 */
  cursor: pointer; /* 마우스 포인터 변경 */
`;

const HoverBox = styled(motion.div)`
  background-color: white;
  width: 100%;
  height: 220px;
  > :hover {
  }
`;
