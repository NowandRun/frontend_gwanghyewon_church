import React, { useEffect, useState } from 'react';
import Mode from './DarkMode';
import styled, { css } from 'styled-components';
import Sitemap from './Sitemap';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const sharedHeaderWidth = css`
  width: 70%;

  ${({ theme }) => theme.media.max1300} {
    width: 100%;
  }
`;

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1300); // ✅ 모바일 여부 감지

  useEffect(() => {
    let ticking = false;
  
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(scrollTop > 0);
          ticking = false;
        });
        ticking = true;
      }
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
    // ✅ 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1300);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // 페이지 경로 변경 시 현재 위치에 해당하는 메뉴 인덱스 설정
  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) =>
      location.pathname === `/${item.path}` || location.pathname.startsWith(`/${item.path}/`)
    );
    setSelectedIndex(currentIndex !== -1 ? currentIndex : null);
  
    // 💡 페이지 전환 후 hover 상태 초기화
    setHoverIndex(null);
    setIsHovered(false);
  }, [location.pathname]);

  const handleHeaderOn = () => setIsHovered(true);
  const handleHeaderOff = () => setIsHovered(false);
  const handleSitemapOpen = (isOpen: boolean) => {
    setIsSitemapOpen(isOpen);
    
    // 💡 닫힐 때 hover 상태도 초기화
    if (!isOpen) {
      setHoverIndex(null);
      setIsHovered(false);
    }
  };

  return (
    <>
      <AllContents 
        isSitemapOpen={isSitemapOpen}  
        isHovered={isHovered}  
        isScrolled={isScrolled} // ✅ 추가
        onMouseEnter={handleHeaderOn}
        onMouseLeave={handleHeaderOff}
        
      >
        <HeaderWrapper
          onMouseEnter={handleHeaderOn}
          onMouseLeave={handleHeaderOff}
        >
          <LeftWrapper>
            <Link to="/">
              <Logo 
                isSitemapOpen={isSitemapOpen}  
                isHovered={isHovered}  
                isScrolled={isScrolled} // ✅ 추가
              >
                <Logoimage 
                  src={
                    isMobile
                      ? process.env.PUBLIC_URL + '/images/logo/new4.png' // ✅ 모바일에서는 항상 new1.png
                      : (isHovered || isScrolled
                          ? process.env.PUBLIC_URL + '/images/logo/new3.png'
                          : process.env.PUBLIC_URL + '/images/logo/new1.png')
                  } 
                  alt="header로고" 
                />
              </Logo>
            </Link>
          </LeftWrapper>

          <CenterWrapper >
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
                    <SubPageItem
                      isSitemapOpen={isSitemapOpen}  
                      isHovered={isHovered}  
                      isScrolled={isScrolled} // ✅ 추가
                      onClick={() => {
                        window.location.href = `/${item.path}`;
                      }}
                    >
                        <SubHeaderPage>{item.label}</SubHeaderPage>
                        {(hoverIndex === index || selectedIndex === index) && (
                          <Positionbar
                          isSitemapOpen={isSitemapOpen}
                          isHovered={isHovered}
                          layoutId="pointerbar"
                        />
                        )}
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
          </CenterWrapper>
          <RightWrapper>
            <UserFeat 
            isSitemapOpen={isSitemapOpen}  
            isHovered={isHovered}  
            isScrolled={isScrolled} // ✅ 추가
            >
              {/* <span>회원가입</span>
              <span>로그인</span> */}
              <ModeWrapper>
                <Mode />
              </ModeWrapper>
            </UserFeat>
          </RightWrapper>
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
};

const AllContents = styled.header<{
  isSitemapOpen: boolean;
  isHovered: boolean;
  isScrolled: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: ${({ isHovered, isSitemapOpen, isScrolled }) =>
    isHovered || isSitemapOpen|| isScrolled ? 'rgba(255, 255, 255, 1)' : 'transparent'};

  box-shadow: ${({ isHovered, isScrolled  }) =>
    isHovered || isScrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
  
  
  transition: ${({isScrolled}) => isScrolled ? `background-color 0.3s ease`: `background-color 0.3s ease`};
  ${({theme}) => theme.media.max1300}{
        /* 모바일에서도 fixed 유지 */
    position: fixed;
    background-color: ${({ theme }) => theme.cardBgColor};
    box-shadow: none;
    color: inherit;
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
  width: 70%;
  ${({theme}) => theme.media.max1300} {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100px; /* 고정된 높이 */
  }
`;

const LeftWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Logoimage = styled.img`
  width: 300px;   /* 원하면 2px 대신 원하는 값 */
  height: auto;
  display: block;
  ${({theme}) => theme.media.max1300} {
    width: 160px;   /* 원하면 2px 대신 원하는 값 */
  }
`;


const CenterWrapper = styled.div`
  flex: 4;
  display: flex;
  width: 100%;
  height:100%;
    background-color: green;
`;

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5rem;
  background-color: blue;
`;

const SubPage = styled.div`
  display: flex;
  height: 100%;
  align-items: stretch; /* stretch로 변경하여 자식 요소가 전체 높이를 차지하도록 함 */
  flex: 1; /* ✅ CenterWrapper 공간을 다 쓰도록 */
  ${({theme}) => theme.media.max1300} {
    display: none;
  }
`;

const MenuGroupWrapper = styled.div`
    display: flex;
    align-items: center;
      justify-content: center;
    flex: 1; /* ✅ CenterWrapper 공간을 다 쓰도록 */
`;

const HoverBox = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100vw;
  left: 50%; /* 가운데 기준점으로 이동 */
  transform: translateX(-50%); /* 정확히 가운데 정렬 */
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

const Logo = styled.div<{
  isSitemapOpen: boolean;
  isHovered: boolean;
  isScrolled: boolean;
}>`
 color: ${({ isHovered, isSitemapOpen, isScrolled }) =>
             isSitemapOpen || isScrolled ? 'black' : isHovered ? 'inherit' :(props)=> props.theme.textColor};
 position: relative;


 ${({theme}) => theme.media.min1301} {
   position: relative;
   padding-right: 150px;
 }
  ${({theme}) => theme.media.max1300} {
   margin-left: 10px;
  }
`;

const SubPageItem = styled.div<{
  isSitemapOpen: boolean;
  isHovered: boolean;
  isScrolled: boolean;
}>`
  color: ${({ isHovered, isSitemapOpen, isScrolled }) =>
             isSitemapOpen || isScrolled ? 'black' : isHovered ? 'inherit' :(props)=> props.theme.textColor};
`;



const Positionbar = styled(motion.div)<PositionbarProps>`
  height: 2px;
  background-color: ${(props) => props.theme.cardBgColor};
  margin-top: 4px;
`;


const UserFeat = styled.div<{
  isSitemapOpen: boolean;
  isHovered: boolean;
  isScrolled: boolean;
}>`
  font-size: 15px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center; /* Center the label text */
  padding-right: 40px;
  span:not(:last-child) {
    margin-right: 15px;
    border-right: 1px solid #ccc; /* 여기에 경계선 추가 */
    padding-right: 10px; /* 경계선과 텍스트 간의 여백 */
  };
   color: ${({ isHovered, isSitemapOpen, isScrolled }) =>
             isSitemapOpen || isScrolled ? 'black' : isHovered ? 'inherit' :(props)=> props.theme.textColor};

  /* 작은 화면에서는 '회원가입'과 '로그인' 숨기기 */
  ${({theme}) => theme.media.max1300} {
    width: 100%;
    display: flex;
    margin-right: 0;
    padding-right: 10px;
    justify-content: flex-end;
    span:not(:last-child) {
      display: none;
    }
  };
`;

const ModeWrapper = styled.div`
  ${({theme}) => theme.media.max1300} {
    margin-right: 8px; /* 여유 공간 확보 */
  } ;
`;



const SitemapWrapper = styled.div`
  position: relative;
  bottom: -20px; /* hr 위에 겹쳐서 보이도록 아래로 배치 */
  top: 0;
  z-index: 1000; /* HoverBox보다 높은 값 */
`;



const SubHeaderPage = styled.span`
  font-size: 18px;
  font-weight: 550;
`;



const SubheadingWrapper = styled.div`
    display: flex;
    align-items: flex-start; /* Align elements to the top */
    max-width: 1400px; /* 2xl screen size */
    margin-left: auto;
    margin-right: auto;
    height: 100%;
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


