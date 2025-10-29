import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Video } from '../../types/types';
import useWindowDimensions from '../useWindowDimensions';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { slideCnt, windowWidthAtom } from '../../types/atoms';
import { SignpostIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const SliderBoxVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.05, zIndex: 100, transition: { duration: 0.3, delay: 0.2 } },
};

interface ISLider {
  data: Video[];
  title: string;
  onVideoClick?: (video: Video) => void; // ✅ prop 추가
}

export default function Slider({ data, title, onVideoClick }: ISLider) {
  const setWindowWidth = useSetRecoilState(windowWidthAtom);
  const windowWidth = useWindowDimensions();
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const offset = useRecoilValue(slideCnt);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isRight, setIsRight] = useState<number>(1); // 1 = next, -1 = prev
  const [startX, setStartX] = useState<number | null>(null);
  const [sliderWidth, setSliderWidth] = useState<number>(windowWidth);
  const navigate = useNavigate(); // <-- useNavigate 훅

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const toggleLeaving = (value: boolean) => setLeaving(value);
  // 슬라이드 거리 계산
  const slideDistance = sliderWidth * (windowWidth > 1300 ? 0.7 : 1) + 60;

  // row variants: custom으로 isRight 전달
  const rowVariants = {
    hidden: (right: number) => ({
      x: right === 1 ? slideDistance : -slideDistance,
      opacity: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 1 },
    },
    exit: (right: number) => ({
      x: right === 1 ? -slideDistance : slideDistance,
      opacity: 0.5,
      transition: { type: 'tween', duration: 1 },
    }),
  };

  // 안전하게 기본값 처리
  const totalVideos = data?.length ?? 0;
  const maxIndex = totalVideos > 0 ? Math.ceil(totalVideos / offset) - 1 : 0;

  const currentipVideos = data?.slice(offset * index, offset * index + offset) ?? [];

  // 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  // 터치 종료
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // 50px 이상 드래그했을 때만
      if (diff > 0) {
        changeIndex(1); // 왼→오 스와이프 → 다음
      } else {
        changeIndex(-1); // 오→왼 스와이프 → 이전
      }
    }
    setStartX(null);
  };

  // 마우스 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
  };

  // 마우스 드래그 끝
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX === null) return;
    const endX = e.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        changeIndex(1);
      } else {
        changeIndex(-1);
      }
    }
    setStartX(null);
  };

  // 인덱스 변경 (right: 1 => next, -1 => prev)
  const changeIndex = (right: number) => {
    if (!data || leaving) return; // 중복 호출 방지
    toggleLeaving(true);
    setIsRight(right);

    if (right === 1) {
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onClickToArrowBtn = (right: number) => {
    // 단순화: data 없거나 애니메이션 진행중이면 무시
    if (!data || leaving) return;
    changeIndex(right);
  };

  // 자동 슬라이드
  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      if (!leaving) {
        changeIndex(1); // 오른쪽으로 이동
      }
    }, 3500); // 3초마다 실행

    return () => clearInterval(interval); // cleanup
  }, [data, leaving, changeIndex]);

  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      } else {
        setSliderWidth(windowWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [windowWidth]);

  /** ✅ 영상 클릭 시 VideoDetail로 이동 + video 데이터 전달 */
  const handleVideoClick = (video: Video) => {
    navigate(`${video.videoId}`, { state: { video, sectionName: '금요설교' } }); // /broadcast/friday/:videoId
  };

  return (
    <SliderWrapper ref={sliderRef}>
      <VideoTitle>
        <VideoIcon>
          <SignpostIcon />
        </VideoIcon>
        <VideoText>{title}</VideoText>
      </VideoTitle>
      <SliderViewport
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <AnimatePresence
          initial={false}
          custom={isRight}
          onExitComplete={() => toggleLeaving(false)}
        >
          <SliderRow
            key={index}
            custom={isRight}
            variants={rowVariants}
            initial="hidden"
            animate="center"
            exit="exit"
          >
            {currentipVideos.map((video) => {
              const thumb = video.snippet.thumbnails;
              const mobileSrc = thumb.maxres?.url || thumb.high?.url; // 모바일은 큰 이미지 우선
              const defaultSrc = thumb.high?.url || thumb.medium?.url;

              return (
                <SliderBox
                  key={video.id}
                  variants={SliderBoxVariants}
                  initial="normal"
                  whileHover="hover"
                  offset={offset}
                  onClick={() => onVideoClick?.(video)} // ✅ 클릭 시 prop 호출
                >
                  <picture>
                    {/* 모바일용 (max-width: 800px) */}
                    <source
                      media="(max-width: 800px)"
                      srcSet={mobileSrc}
                    />
                    {/* 기본 */}
                    <img
                      src={defaultSrc}
                      srcSet={`
                        ${thumb.default?.url} 480w,
                        ${thumb.medium?.url} 768w,
                        ${thumb.high?.url} 1280w
                      `}
                      sizes="(max-width: 70vw) 70vw, 100vw"
                      alt={video.snippet.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </picture>
                </SliderBox>
              );
            })}
          </SliderRow>
          <SliderPrev
            onClick={() => onClickToArrowBtn(-1)}
            disabled={leaving}
          >
            &lt;
          </SliderPrev>
          <SliderNext
            onClick={() => onClickToArrowBtn(1)}
            disabled={leaving}
          >
            &gt;
          </SliderNext>
        </AnimatePresence>
      </SliderViewport>
    </SliderWrapper>
  );
}

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: 1vw;
`;

const VideoTitle = styled.div`
  font-size: 2vw;
  font-weight: 700;
  display: flex;
  align-items: center; // 세로 중앙 정렬
  color: ${(props) => props.theme.textColor};

  ${({ theme }) => theme.media.tablet} {
    font-size: 3vw;
  }
`;

const VideoIcon = styled.div`
  display: flex;

  align-items: center; // 세로 중앙 정렬
  justify-content: center; // 가로 중앙 정렬
  font: ${(props) => props.theme.textColor};
`;

const VideoText = styled.div`
  padding-left: 1vw;
`;

const SliderViewport = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
  display: flex;
  aspect-ratio: 14 / 2; // 또는 원하는 높이 계산
  ${({ theme }) => theme.media.tablet} {
    aspect-ratio: 16 / 3; // 또는 원하는 높이 계산
  }

  ${({ theme }) => theme.media.mobile} {
    aspect-ratio: 16 / 5; // 또는 원하는 높이 계산
  }
`;

const SliderRow = styled(motion.div)`
  display: flex;
  gap: 5px;
  position: absolute;
  left: 0;
  justify-content: center; // 가로 중앙 정렬
  align-items: center; // 세로 중앙 정렬
`;

const SliderBox = styled(motion.div)<{ offset: number }>`
  // ✅ 반응형 비율 유지
  aspect-ratio: 16 / 9;
  max-width: 70vw; // 뷰포트 기준 최대 너비
  padding: 0.5vw;
  img {
    width: 100%;
    height: auto;
    max-width: 70vw; // 뷰포트 기준 최대 너비
    &:hover {
      z-index: 100;
    }
  }
  @media (max-width: 800px) {
    aspect-ratio: 16 /10;
    max-width: 70vw; // 뷰포트 기준 최대 너비
  }
`;

const SliderPrev = styled.button`
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5vw;
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
    width: 3vw;
    height: 3vw;
  }
`;

const SliderNext = styled.button`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5vw;
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
    width: 3vw;
    height: 3vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
