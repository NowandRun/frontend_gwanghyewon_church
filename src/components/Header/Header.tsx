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
    label: '교회소개',
    children: [
      {
        path: '',
        label: '담임목사 인사말',
      },
      {
        path: 'minister',
        label: '섬기는분들',
      },
      {
        path: 'guide',
        label: '예배안내',
      },
      {
        path: 'location',
        label: '찾아오시는 길',
      },
    ],
  },
  {
    path: 'youth',
    subtitle: 'youth',
    label: '교회학교',
    children: [
      {
        path: '',
        label: '하꿈주일학교',
      },
      {
        path: 'students',
        label: '예람청소년부',
      },
      {
        path: 'young-adult',
        label: '하람청년부',
      },
    ],
  },
  {
    path: 'broadcast',
    subtitle: 'gs broadcast',
    label: 'GS방송',
    children: [
      {
        path: '',
        label: '주일설교',
      },
      {
        path: 'friday',
        label: '금요설교',
      },
      {
        path: 'special',
        label: '기타영상',
      },
    ],
  },
  {
    path: 'group',
    subtitle: '새가족',
    label: '새가족',
    children: [
      {
        path: '',
        label: '새가족',
      },
      {
        path: 'worship',
        label: '예배',
      },
      {
        path: 'nurture',
        label: '양육',
      },
      {
        path: 'baptism',
        label: '세례',
      },
      {
        path: 'ministration',
        label: '봉사',
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
        label: '교회소식',
      },
      {
        path: 'album',
        label: '교우동정',
      },
      {
        path: 'bulletin',
        label: '교회주보',
      },
    ],
  },
  {
    path: 'offering',
    subtitle: 'online offering',
    label: '온라인 헌금',
    children: [
      {
        path: '',
        label: '온라인 헌금',
      },
    ],
  },
];


export const HEADER_HEIGHT = 0;

function Header() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);

  // 페이지 경로 변경 시 현재 위치에 해당하는 메뉴 인덱스 설정
  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) =>
      location.pathname === `/${item.path}` || location.pathname.startsWith(`/${item.path}/`)
    );
    setSelectedIndex(currentIndex !== -1 ? currentIndex : null);
  }, [location.pathname]);

  const handleHeaderOn = () => setIsHovered(true);
  const handleHeaderOff = () => setIsHovered(false);
  const handleSitemapOpen = (isOpen: boolean) => setIsSitemapOpen(isOpen);

  return (
    <>
      <AllContents isSitemapOpen={isSitemapOpen}  
        isHovered={isHovered}  
        onMouseEnter={handleHeaderOn}
        onMouseLeave={handleHeaderOff}
      >
        <HeaderWrapper
          onMouseEnter={handleHeaderOn}
          onMouseLeave={handleHeaderOff}
        >
          <Link to="/">
            <Logo>
              <span>로고</span>
            </Logo>
          </Link>

          <SubPage>
            {menuItems.map((item, index) => (
              <MenuGroupWrapper
                key={index}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <Link to={`/${item.path}`} onClick={() => {
                  setSelectedIndex(index);
                  setHoverIndex(null);      // Hover 초기화
                  setIsHovered(false);      // Hover 상태 플래그 초기화
                }}>
                  <SubPageItem>
                    <div style={{ margin: '20px' }}>
                      <SubHeaderPage>{item.label}</SubHeaderPage>
                      {(hoverIndex === index || selectedIndex === index) && (
                        <Positionbar
                          isSitemapOpen={isSitemapOpen}
                          isHovered={isHovered}
                          layoutId="pointerbar"
                        />
                      )}
                    </div>
                  </SubPageItem>
                </Link>

                {hoverIndex === index && (
                  <HoverBox>
                     <ScrollContent>
                      <SubheadingWrapper>
                        <Subheading>
                          <span>{item.subtitle}</span>
                          <span>{item.label}</span>
                        </Subheading>
                        <Separator />
                        <SubheadingChildren>
                        {item.children.map((child, childIdx) => (
                            <Link
                              key={childIdx}
                              to={`/${item.path}/${child.path}`}
                              onClick={() => {
                                setSelectedIndex(index);
                                setHoverIndex(null);     // Hover 초기화
                                setIsHovered(false);     // Hover 상태 플래그 초기화
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </SubheadingChildren>
                      </SubheadingWrapper>
                    </ScrollContent>
                  </HoverBox>
                )}
              </MenuGroupWrapper>
            ))}
          </SubPage>

          <UserFeat>
            <span>회원가입</span>
            <span>로그인</span>
            <ModeWrapper>
              <Mode />
            </ModeWrapper>
          </UserFeat>

          <SitemapWrapper>
            <Sitemap onOpenChange={handleSitemapOpen} />
          </SitemapWrapper>
        </HeaderWrapper>
      </AllContents>
    </>
  );
}

export default Header;
interface PositionbarProps {
  isSitemapOpen: boolean;
  isHovered: boolean;
}



const AllContents = styled.header<{
  isSitemapOpen: boolean;
  isHovered: boolean;
}>`
position: fixed;
  top: 0;
  left: 0;
  width: 100%;

    z-index: 10;
 transition: background-color 0.3s ease;
  background-color: ${({ isHovered, isSitemapOpen }) =>
    isHovered || isSitemapOpen ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  box-shadow: ${({ isHovered }) =>
    isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};

  ${({theme}) => theme.media.min1301} {
    background-color: transparent; // hover가 아닐 때도 투명 유지

    &:hover {
      color: ${({ isHovered, isSitemapOpen }) =>
        isHovered || isSitemapOpen ? 'black' : 'inherit'};
      background-color: ${({ isHovered, isSitemapOpen }) =>
        isHovered || isSitemapOpen ? 'white' : 'transparent'};
    }
  }

   ${({theme}) => theme.media.max1300}{
    position: sticky;
    background-color: ${({ theme }) => theme.cardBgColor};
    box-shadow: none;
  }
`;

const HeaderWrapper = styled.div`
  position: relative ; /* 절대 위치로 설정하여 다른 내용에 영향 미치지 않도록 함 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  height: 120px; /* 고정된 높이 */
  ${({theme}) => theme.media.max1300} {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
  }
`;

const SubPage = styled.div`
  position: static ; /* 절대 위치로 설정하여 다른 내용에 영향 미치지 않도록 함 */
  display: flex;
  align-items: center;
  right : 10px;
  font-size: 20px;
  font-weight: bold;
  height: 100%;
  align-items: stretch; /* stretch로 변경하여 자식 요소가 전체 높이를 차지하도록 함 */
  /* 작은 화면에서는 숨기기 */
  ${({theme}) => theme.media.max1300} {
    display: none;
  }
`;

const MenuGroupWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
`;

const HoverBox = styled.div`
 position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 220px;
  background-color: white;
  z-index: 10;
  justify-content: center;
`;

const ScrollContent = styled.div`
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Logo = styled.div`
 position: relative;
 ${({theme}) => theme.media.min1301} {
   transition: 1s;
   font-size: 45px;
   font-size: 15px;

   position: relative;
   margin-left: 400px;
   margin-right: 50px;
 }
  ${({theme}) => theme.media.max1300} {
    transition: 1s;
  margin-left: 10px;
  font-size: 45px;
    font-size: 15px;
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

const Positionbar = styled(motion.div)<PositionbarProps>`
  height: 2px;
 background-color: ${(props) => props.theme.cardBgColor};
  margin-top: 4px;
`;


const UserFeat = styled.div`
  font-size: 13px;
  display: flex;
  position: relative;
  align-items: center;
justify-content: center; /* Center the label text */
  span:not(:last-child) {
    margin-right: 15px;
    border-right: 1px solid #ccc; /* 여기에 경계선 추가 */
    padding-right: 10px; /* 경계선과 텍스트 간의 여백 */
  };

  /* 작은 화면에서는 '회원가입'과 '로그인' 숨기기 */
  ${({theme}) => theme.media.max1300} {
    width: 100%;
    display: flex;
    margin-right: 0;
    justify-content: space-between;
    justify-content: flex-end;
    span:not(:last-child) {
      display: none;
    }
  };
`;

const ModeWrapper = styled.div`
  ${({theme}) => theme.media.max1300} {
    margin-right: 10px; /* 여유 공간 확보 */
  } ;
`;



const SitemapWrapper = styled.div`
    position: relative;
  bottom: -20px; /* hr 위에 겹쳐서 보이도록 아래로 배치 */
  top: 0;
  z-index: 1000; /* HoverBox보다 높은 값 */
  ${({theme}) => theme.media.max1300}{
    position: relative;
  };
    ${({theme}) => theme.media.min1301} {
    position: relative;
    margin-right: 400px;
    margin-left: 0;
    
  }
`;



const SubHeaderPage = styled.span`
  font-size: 18px;
`;



const SubheadingWrapper = styled.div`

 

  ${({theme}) => theme.media.min1301} {
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


