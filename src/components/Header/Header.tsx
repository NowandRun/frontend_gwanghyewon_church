import React, { useEffect, useState } from 'react';
import Mode from './DarkMode';
import styled from 'styled-components';
import Sitemap from './Sitemap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const menuItems = [
  {
    path: 'info',
    subtitle: 'about church',
    label: '교회안내',
    children: [
      {
        path: '',
        label: '교회소개',
      },
      {
        path: 'greeting',
        label: '담임목사 인사말',
      },
      {
        path: 'guide',
        label: '예배안내',
      },
      {
        path: 'location',
        label: '찾아오시는 길',
      },
      {
        path: 'invite',
        label: '새가족 등록안내',
      },
    ],
  },
  {
    path: 'ministro',
    subtitle: 'minister',
    label: '섬기는 이들',
    children: [
      {
        path: '',
        label: '교역자 소개',
      },
      {
        path: 'elder',
        label: '장로',
      },
      {
        path: 'deacons',
        label: '안수집사',
      },
      {
        path: 'senior-deacons',
        label: '권사',
      },
    ],
  },
  {
    path: 'sermon',
    subtitle: 'sermon',
    label: '설교',
    children: [
      {
        path: '',
        label: '주일예배',
      },
      {
        path: 'wednesday',
        label: '수요예배',
      },
      {
        path: 'friday',
        label: '금요예배',
      },
      {
        path: 'special',
        label: '특별집회',
      },
    ],
  },
  {
    path: 'youth',
    subtitle: 'youth',
    label: '다음세대',
    children: [
      {
        path: '',
        label: '하꿈공동체(초등부)',
      },
      {
        path: 'students',
        label: '하람공동체(학생부)',
      },
      {
        path: 'young-adult',
        label: '예람공동체(청년부)',
      },
    ],
  },
  {
    path: 'group',
    subtitle: '교육 소그룹',
    label: '교육 소그룹',
    children: [
      {
        path: '',
        label: '새신자반',
      },
      {
        path: 'growth-class',
        label: '성장반',
      },
      {
        path: 'bible-study',
        label: 'Bible Study',
      },
      {
        path: 'cell-leader',
        label: '구역장 모임',
      },
      {
        path: 'intercession',
        label: '중보기도 모임',
      },
    ],
  },
  {
    path: 'missionary',
    subtitle: 'missionary',
    label: '전도 선교',
    children: [
      {
        path: '',
        label: '해외선교',
        children: [
          {
            path: 'cambodia',
            label: '캄보디아',
          },
          {
            path: 'thailand',
            label: '태국',
          },
        ],
      },
      {
        path: 'korea',
        label: '국내선교',
      },
      {
        path: 'news',
        label: '선교 편지',
      },
    ],
  },
  {
    path: 'news',
    subtitle: 'news',
    label: '교회소식',
    children: [
      {
        path: '',
        label: '금주주보',
      },
      {
        path: 'album',
        label: '사진첩',
      },
      {
        path: 'hospitality',
        label: '새가족',
      },
    ],
  },
];

function Header() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null); // hover 상태 추가
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  // 메뉴 항목의 경로

  const handleHeaderOn = (isHover: boolean) => {
    setIsHovered(isHover);
  };

  const handleHeaderOff = (isHoverOff: boolean) => {
    setIsHovered(isHoverOff);
  };

  const handleSitemapOpen = (isOpen: boolean) => {
    setIsSitemapOpen(isOpen);
  };

  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) => {
      return location.pathname.startsWith(`/${item.path}`);
    });
    // true 값의 인덱스를 찾음
    setActiveIndex(currentIndex !== -1 ? currentIndex : null);
  }, [location.pathname]);

  return (
    <>
      <AllContents isSitemapOpen={isSitemapOpen} isHovered={isHovered}>
        <HeaderWrapper
          onMouseEnter={() => handleHeaderOn(true)}
          onMouseLeave={() => handleHeaderOff(false)}
        >
          <Link to='/'>
            <Logo>
              <span>교회로고</span>
            </Logo>
          </Link>
          <SubPage>
            {menuItems.map((item, index) => (
              <Link to={item.path} key={index}>
                <SubPageItem
                  onMouseEnter={() => {
                    setHoverIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(null);
                  }}
                >
                  <div style={{ margin: '20px' }}>
                    <SubHeaderPage>{item.label}</SubHeaderPage>
                    {/* 현재 활성화된 메뉴나 호버된 메뉴일 경우 밑줄 표시 */}
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
              <Sitemap onOpenChange={(open) => handleSitemapOpen(open)} />
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
                <SubheadingWrapper>
                  <Subheading>
                    <span>{item.subtitle}</span>
                    <span>{item.label}</span>
                  </Subheading>
                  <Separator />
                  <SubheadingChildren>
                    {item.children.map((child, idx) => (
                      <Link
                        to={`${menuItems[hoverIndex].path}/${child.path}`}
                        key={idx}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </SubheadingChildren>
                </SubheadingWrapper>
              </HoverBox>
            )
        )}
      </AllContents>
    </>
  );
}

export default Header;

const AllContents = styled.header<{
  isSitemapOpen: boolean;
  isHovered: boolean;
}>`
  position: relative; /* 다른 컴포넌트와의 상대 위치를 설정 */
  transition: ${(props) =>
    props.isSitemapOpen ? 'none' : 'background-color 1s'};
  background-color: ${(props) =>
    props.isSitemapOpen ? 'none' : 'transparent'};

  @media (min-width: 1300px) {
    &:hover {
      color: ${(props) => {
        if (!props.isHovered) {
          return 'none';
        } else if (props.isSitemapOpen) {
          return 'black';
        } else {
          return 'black';
        }
      }};
      background-color: ${(props) => {
        if (props.isSitemapOpen) {
          return 'white';
        } else if (props.isHovered) {
          return 'white';
        } else {
          return 'none';
        }
      }};
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
  font-size: 45px;
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
  font-size: 13px;
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

const SubHeaderPage = styled.span`
  font-size: 18px;
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
`;

const SubheadingWrapper = styled.div`
  @media (min-width: 1300px) {
    display: flex;
    align-items: flex-start; /* Align elements to the top */
    max-width: 1400px; /* 2xl screen size */
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }
`;

const Separator = styled.div`
  width: 1px; /* 선의 두께 */
  background-color: rgba(0, 0, 0, 0.1); /* 선의 색상 */
  height: 100%; /* 높이를 부모 요소에 맞춤 */
  margin: 0 20px; /* 선과 양쪽 요소 사이의 여백 설정 */
`;

const Subheading = styled.div`
  font-size: 25px;
  width: 12.8%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align text to the top */
  font-weight: 550;
  padding-left: 35px;
  padding-top: 60px; /* 상단 여백 추가 */
  /* subtitle을 대문자로 변환 */
  span:first-child {
    font-size: 13px;
    text-transform: uppercase;
  }
`;

const SubheadingChildren = styled.div`
  padding-left: 35px;
  display: grid;
  grid-template-columns: repeat(
    5,
    1fr
  ); /* 2개의 열로 구성, 각 열이 동일한 너비 */
  font-size: 17px;
  grid-gap: 50px; /* 각 요소 간의 간격 설정 */
  height: 100%;
  width: 75%;
  font-weight: bolder;
  position: relative; /* Positionbar가 텍스트 아래에 맞게 위치할 수 있도록 설정 */
  align-items: flex-start; /* Align elements to the top */
  justify-content: center; /* Center the label text */
  padding-top: 60px; /* 상단 여백 추가 */
`;
