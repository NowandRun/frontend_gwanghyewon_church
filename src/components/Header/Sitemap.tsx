import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useWindowDimensions from '../useWindowDimensions';
import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '../Navicaton';

// onOpenChange의 타입을 함수로 정의
interface SitemapProps {
  onOpenChange: (isOpen: boolean) => void; // Correctly define the type of the function
}

const Sitemap: React.FC<SitemapProps> = ({ onOpenChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const width = useWindowDimensions();

  const openModal = () => {
    setIsOpen(true);
    onOpenChange(true); // 부모에 알림
  };
  const closeModal = () => {
    setIsOpen(false);
    onOpenChange(false); // 부모에 알림
  };

  useEffect(() => {
    const currentIndex = menuItems.findIndex(
      (item) =>
        location.pathname === `/${item.path}` || location.pathname.startsWith(`/${item.path}/`),
    );
    setSelectedIndex(currentIndex !== -1 ? currentIndex : null);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // html까지 차단
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={openModal}
        layoutId="Sitemap"
      >
        <FontAwesomeIcon icon={faMapLocationDot} />
        <div>
          <span>SITEMAP</span>
          <span>전체메뉴</span>
        </div>
      </Button>
      <AnimatePresence>
        {isOpen && width >= 1900 && (
          <Overlay
            initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <ModalBox layoutId="Sitemap">
              <ModalBoxWrapper>
                <HeaderTitle>
                  <span>사이트 맵</span>
                </HeaderTitle>
                <ChildContent>
                  {menuItems.map((item, index) => (
                    <ItemWrapper key={index}>
                      {/* 부모 메뉴 표시 */}
                      <ItemTitle>
                        <Link to={`/${item.path}`}>
                          <h3>{item.label}</h3>
                        </Link>
                      </ItemTitle>
                      {/* children이 있는지 확인 후 출력 */}
                      {item.children && (
                        <ul>
                          {item.children.map((child, childIndex) => (
                            <SubChildList key={childIndex}>
                              <SubChildListTitle>
                                <Link to={`/${item.path}/${child.path}`}>{child.label}</Link>
                              </SubChildListTitle>
                            </SubChildList>
                          ))}
                        </ul>
                      )}
                    </ItemWrapper>
                  ))}
                </ChildContent>
              </ModalBoxWrapper>
              <BottomBox />
            </ModalBox>
          </Overlay>
        )}
        {isOpen && width < 1900 && (
          <Overlay
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <ModalBox
              layout={'size'} // 레이아웃 변화를 애니메이션으로 처리
              variants={modalBoxVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.3,
                type: 'tween',
                // combine opacity and scale
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
            >
              <ModalBoxWrapper>
                <HeaderTitle>
                  <span>사이트 맵</span>
                </HeaderTitle>
                <ChildContent>
                  {menuItems.map((item, index) => (
                    <ItemWrapper key={index}>
                      {/* 부모 메뉴 표시 */}
                      <ItemTitle>
                        <Link to={`/${item.path}`}>
                          <h3>{item.label}</h3>
                        </Link>
                      </ItemTitle>
                      {/* children이 있는지 확인 후 출력 */}
                      {item.children && (
                        <ul>
                          {item.children.map((child, childIndex) => (
                            <SubChildList key={childIndex}>
                              <SubChildListTitle>
                                <Link to={`/${item.path}/${child.path}`}>{child.label}</Link>
                              </SubChildListTitle>
                            </SubChildList>
                          ))}
                        </ul>
                      )}
                    </ItemWrapper>
                  ))}
                </ChildContent>
              </ModalBoxWrapper>
              <BottomBox />
            </ModalBox>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sitemap;

const modalBoxVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  }, // 오른쪽에서 시작
  visible: {
    x: 0,
    opacity: 1, // 원래 위치로 이동할 때 나타남
  }, // 원래 위치로 이동
  exit: {
    opacity: 0, // 나가면서 동시에 투명해짐
    x: '100%',
    backgroundColor: 'none',
  }, // 오른쪽으로 나가면서 종료
};

const Button = styled(motion.div)`
  position: fixed; /* 화면 고정 */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  background-color: ${(props) => props.theme.cardBgColor};
  height: 7vw;
  width: 6vw;
  color: ${(props) => props.theme.textColor};
  text-align: center;
  font-weight: 600;
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition:
    background-color 1s,
    color 1s;
  /* 첫 번째 자식 요소에만 적용 */
  > :first-child {
    font-size: 2vw;
    position: relative; /* position을 relative로 설정 */
    ${({ theme }) => theme.media.tablet} {
      font-size: 28px; // 원하는 크기로 조정
    }
  }
  > :last-child {
    position: relative; /* position을 relative로 설정 */
    top: 0.5vw; /* y축 방향으로 아래쪽으로 이동 */

    span {
      display: block;
      font-size: 0.8vw;
      ${({ theme }) => theme.media.tablet} {
        font-size: 0.8rem; // 원하는 크기로 조정
      }
    }
  }

  ${({ theme }) => theme.media.tablet} {
    height: 110px;
    width: 80px;
    right: 0; /* 모바일에서도 오른쪽 유지 */
    top: 0; /* 모바일에서도 상단 유지 */
  }
`;

/*  👇 스크롤 이벤트 제거 
  overflow: hidden;      내부 스크롤 막기 
  touch-action: none;    모바일 터치 스크롤/줌 방지 
  overscroll-behavior: none; 바운스 스크롤 방지 
   */
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0); // 초기 상태를 투명으로 설정
  transition: none;

  ${({ theme }) => theme.media.tablet} {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
`;

const ModalBox = styled(motion.div)`
  background-color: white;
  color: black;
  width: 50%;
  height: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  > ::-webkit-scrollbar {
    display: none;
  }
  position: relative; /* 추가: 내부 요소가 상대적으로 위치할 수 있게 함 */
  will-change: transform, opacity; // 성능 개선을 위한 will-change 추가
  ${({ theme }) => theme.media.tablet} {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    will-change: transform, opacity; // 성능 개선을 위한 will-change 추가
    /* 모바일에서 슬라이드 애니메이션을 위한 스타일 */
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto; /* 모바일에서도 스크롤 허용 */
  }
`;

const ModalBoxWrapper = styled.div`
  max-height: calc(100% - 10px);
  overflow-y: auto; /* 내부 콘텐츠 스크롤 허용 */

  ${({ theme }) => theme.media.tablet} {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    will-change: transform, opacity; // 성능 개선을 위한 will-change 추가
    /* 모바일에서 슬라이드 애니메이션을 위한 스타일 */
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto; /* 모바일에서도 스크롤 허용 */
  }
`;

const HeaderTitle = styled.div`
  background-color: black;
  color: white;
  padding: 2vw;
  font-size: 1.5vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 5vw;
    padding: 3vw;
  }
`;

const ItemWrapper = styled.div``;

const ItemTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid black;

  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
    justify-content: flex-start;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 4vw;
  }
`;

const SubChildList = styled.li``;

const SubChildListTitle = styled.div`
  border-bottom: 1.5px dotted rgba(0, 0, 0, 0.4);
  padding-left: 8px;
  margin: 3px auto;
`;

const ChildContent = styled.div`
  padding: 2.5vw 1vw;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 2개의 열로 구성, 각 열이 동일한 너비 */
  gap: 0.8vw; /* 그리드 아이템 간의 간격 */
  max-height: 100%; /* 모달 높이를 벗어나지 않도록 설정 */
  overflow-y: auto; /* 넘칠 경우 스크롤 가능 */
  font-size: 1vw;
  ${({ theme }) => theme.media.tablet} {
    display: flex;
    flex-direction: column;
    will-change: transform, opacity; // 성능 개선을 위한 will-change 추가
    /* 모바일에서 슬라이드 애니메이션을 위한 스타일 */
    position: relative;
    left: 0;
    top: 0;
    bottom: 0;
    padding: 10vw 1vw;
    overflow-y: auto; /* 모바일에서도 스크롤 허용 */
    font-size: 3vw;
    /* 스크롤바 숨기기 (크로스 브라우징) */
    -ms-overflow-style: none; /* IE, Edge */
    scrollbar-width: none; /* Firefox */
    gap: 10vw; /* 그리드 아이템 간의 간격 */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari */
    }
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 4vw;
  }
`;

const BottomBox = styled.div`
  background-color: black;
  height: 20px; /* 고정된 높이값 설정 */
  bottom: 0; /* 하단에 위치 */
  width: 100%; /* 부모의 너비에 맞게 설정 */
  position: absolute;
`;
