import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { FIND_ALL_MAIN_POPUP_BOARD_QUERY } from 'src/types/grapql_call';
import { MainPopupModule } from '../MainPopup/MainPopupModule';
import styled from 'styled-components';

function MainPopup() {
  const { data, loading } = useQuery(FIND_ALL_MAIN_POPUP_BOARD_QUERY, {
    variables: { input: { page: 1, take: 10 } },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleIds, setVisibleIds] = useState<number[]>([]);
  const [isAllClosed, setIsAllClosed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const popups = data?.findAllMainPopupBoard?.results || [];
  const filteredPopups = popups.filter((p: any) => visibleIds.includes(p.id));

  // 특정 인덱스로 스크롤 이동하는 함수 (공통 로직)
  const scrollToSlide = useCallback((index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const slides = container.querySelectorAll('.card-item');
      if (slides[index]) {
        slides[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center', // 중앙 정렬로 완벽하게 자리를 잡음
        });
      }
    }
  }, []);

  // 버튼 클릭 핸들러
  const handleNavClick = (direction: 'left' | 'right') => {
    let nextIndex = currentIndex;
    if (direction === 'left' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < filteredPopups.length - 1) {
      nextIndex = currentIndex + 1;
    }
    scrollToSlide(nextIndex);
  };

  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleNavClick('left');
      if (e.key === 'ArrowRight') handleNavClick('right');
      if (e.key === 'Escape') setIsAllClosed(true); // ESC 누르면 닫기
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredPopups.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      // 좀 더 정확한 인덱스 계산을 위해 소수점 반올림 사용
      const newIndex = Math.round(
        scrollLeft / (e.currentTarget.scrollWidth / filteredPopups.length),
      );
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    if (data?.findAllMainPopupBoard?.results) {
      const results = data.findAllMainPopupBoard.results;
      const now = new Date().getTime();
      const activeIds = results
        .filter((p: any) => {
          const hiddenUntil = localStorage.getItem(`hide_popup_${p.id}`);
          return !hiddenUntil || now > parseInt(hiddenUntil);
        })
        .map((p: any) => p.id);
      setVisibleIds(activeIds);
    }
  }, [data]);

  const handleCloseAll = () => setIsAllClosed(true);
  const handleCloseAllToday = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    visibleIds.forEach((id) => localStorage.setItem(`hide_popup_${id}`, expiry.toString()));
    handleCloseAll();
  };

  if (loading || visibleIds.length === 0 || isAllClosed) return null;

  return (
    <PopupLayerWrapper>
      <GlobalControls>
        <IconButton onClick={handleCloseAllToday}>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            ></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <IconLabel>전체 오늘 하루 보지 않기</IconLabel>
        </IconButton>
        <IconButton onClick={handleCloseAll}>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            ></line>
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            ></line>
          </svg>
        </IconButton>
      </GlobalControls>

      {filteredPopups.length > 1 && (
        <>
          <NavButton
            className="left"
            onClick={() => handleNavClick('left')}
          >
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </NavButton>
          <NavButton
            className="right"
            onClick={() => handleNavClick('right')}
          >
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </NavButton>
        </>
      )}

      <SlideTrack
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {filteredPopups.map((popup: any, index: number) => {
          let parsedBlocks = popup.blocks;
          try {
            if (typeof popup.blocks === 'string') parsedBlocks = JSON.parse(popup.blocks);
          } catch (e) {
            console.error(e);
          }

          return (
            <CardWrapper
              key={popup.id}
              className="card-item" // 식별을 위해 클래스 추가
              active={index === currentIndex}
            >
              <MainPopupModule
                id={popup.id}
                index={index}
                title={popup.title}
                blocks={parsedBlocks}
              />
            </CardWrapper>
          );
        })}
      </SlideTrack>

      {filteredPopups.length > 1 && (
        <PaginationBadge>
          {currentIndex + 1} / {filteredPopups.length}
        </PaginationBadge>
      )}
    </PopupLayerWrapper>
  );
}

export default MainPopup;

/* 스타일 컴포넌트는 이전과 동일하되 CardWrapper에 클래스 식별 용도만 추가 */
const PopupLayerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SlideTrack = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  /* padding 대신 가상 요소를 사용하기 위해 padding 제거 */
  padding: 0;
  gap: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  /* 첫 번째 카드 앞에 여백 생성 */
  &::before {
    content: '';
    flex-shrink: 0;
    width: 12vw; /* 기존 padding 값과 동일 */
  }

  /* 마지막 카드 뒤에 여백 생성 */
  &::after {
    content: '';
    flex-shrink: 0;
    width: 12vw;
  }
`;

const CardWrapper = styled.div<{ active: boolean }>`
  flex-shrink: 0;
  width: 76vw;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s;
  transform: ${(props) => (props.active ? 'scale(1)' : 'scale(0.9)')};
  opacity: ${(props) => (props.active ? 1 : 0.4)};

  /* 이 부분이 핵심: 모든 기기에서 중앙에 딱 멈추도록 설정 */
  scroll-snap-align: center;
`;

const PaginationBadge = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: white;
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  z-index: 10003;
`;
const NavButton = styled.button`
  position: absolute;
  top: 0;
  height: 100%;
  /* 1. 클릭 영역 확장: 화면의 약 15% 정도를 클릭 영역으로 확보 */
  width: 15vw;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &.left {
    left: 0;
    /* 왼쪽 끝에서부터 은은하게 어두워지는 그라데이션 */
    background: linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  }

  &.right {
    right: 0;
    /* 오른쪽 끝에서부터 은은하게 어두워지는 그라데이션 */
    background: linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
  }

  svg {
    width: 50px; /* 아이콘 크기를 키워 시인성 확보 */
    height: 50px;
    opacity: 0.2; /* 평소에는 아주 미세하게 보임 */
    transition: all 0.4s ease;
    stroke: white;
    stroke-width: 1.5; /* 선을 얇게 하여 고급스러움 유지 */

    /* 화살표가 화면 바깥쪽에서 대기하는 느낌 */
    transform: translateX(${(props) => (props.className === 'left' ? '-15px' : '15px')});
  }

  &:hover {
    /* 호버 시 해당 영역이 더 명확하게 어두워짐 */
    background: ${(props) =>
      props.className === 'left'
        ? 'linear-gradient(to right, rgba(0, 0, 0, 0.6) 0%, transparent 100%)'
        : 'linear-gradient(to left, rgba(0, 0, 0, 0.6) 0%, transparent 100%)'};

    svg {
      opacity: 1;
      transform: translateX(0); /* 화살표가 중앙으로 부드럽게 들어옴 */
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)); /* 은은한 발광 효과 */
    }
  }

  /* 클릭 시 피드백 애니메이션 */
  &:active svg {
    transform: scale(0.9) translateX(${(props) => (props.className === 'left' ? '-5px' : '5px')});
    opacity: 0.7;
  }

  ${({ theme }) => theme.media.mobile} {
    /* 모바일에서는 영역이 너무 크면 스크롤을 방해하므로 너비를 줄임 */
    width: 50px;
    background: transparent !important;
    svg {
      opacity: 0;
    } /* 모바일은 스와이프 위주이므로 버튼 숨김 */
  }
`;
const GlobalControls = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  gap: 12px;
  z-index: 10002;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px 18px;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const IconLabel = styled.span`
  font-size: 13px;
  ${({ theme }) => theme.media.mobile} {
    display: none;
  }
`;
