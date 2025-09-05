import React, { useState, useRef, useEffect } from "react";
import { fetchYouTubeChannelInfo } from "../../types/api";
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from "react-query";
import { IGetPlaylist } from "../../types/types";
import useWindowDimensions from "../../components/useWindowDimensions";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { slideCnt, windowWidthAtom } from "../../types/atoms";
import {ClockLoader} from "react-spinners";

const boxVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.05, zIndex: 100, transition: { duration: 0.3, delay: 0.2, } },
};

function YouTubeMainVideo() {
  const setWindowWidth = useSetRecoilState(windowWidthAtom);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const { data, isLoading } = useQuery<IGetPlaylist[]>(
    ["sundayWorshipVideos", "fridayWorshipVideos"],
    fetchYouTubeChannelInfo
  );

  const offset = useRecoilValue(slideCnt);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isRight, setIsRight] = useState<number>(1); // 1 = next, -1 = prev

  const windowWidth = useWindowDimensions();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [sliderWidth, setSliderWidth] = useState<number>(windowWidth);
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
      } else {
        setSliderWidth(windowWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [windowWidth]);

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
      transition: { type: "tween", duration: 1 },
    },
    exit: (right: number) => ({
      x: right === 1 ? -slideDistance : slideDistance,
      opacity: 0.5,
      transition: { type: "tween", duration: 1 },
    }),
  };

  // 현재 보여줄 비디오 목록 (publishedAt 기준 최신순 12개)
const sortedVideos =
data?.[3]?.videos
  ?.slice() // 원본 배열 변경 방지
  ?.sort(
    (a, b) =>
      new Date(b.snippet.publishedAt).getTime() -
      new Date(a.snippet.publishedAt).getTime()
  ) || [];

const limitedVideos = sortedVideos.slice(0, 12);

// 현재 보여줄 비디오 목록 (페이징 적용)
const currentVideos = limitedVideos.slice(offset * index, offset * index + offset);
    

const totalVideos = limitedVideos.length;
const maxIndex = Math.ceil(totalVideos / offset) - 1;

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

  return (
    <HomeYouTubeWapper>
      {isLoading ? (
        <Loader><ClockLoader color="#ffffff"/></Loader>
      ) : (
        // sliderRef를 여기(SliderWrapper)에 붙여서 width 측정하게 함
        <SliderWrapper ref={sliderRef}>
          
          <Slider>
            <Prev onClick={() => onClickToArrowBtn(-1)} disabled={leaving}>
                &lt;
            </Prev>
            <AnimatePresence
              initial={false}
              custom={isRight}
              onExitComplete={() => toggleLeaving(false)}
            >
              <Row
                key={index}
                custom={isRight}
                variants={rowVariants}
                initial="hidden"
                animate="center"
                exit="exit"
              >
                {currentVideos.map((video) => (
                    <Box
                    key={video.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    offset={offset}
                    
                  >
                    <img
                      src={video.snippet.thumbnails?.high?.url}
                      srcSet={`
                        ${video.snippet.thumbnails?.default?.url} 480w,
                        ${video.snippet.thumbnails?.medium?.url} 768w,
                        ${video.snippet.thumbnails?.high?.url} 1280w
                      `}
                      sizes="(max-width: 70vw) 70vw, 100vw"
                      alt={video.snippet.title}
                      loading="lazy" // 화면에 보여질 때 이미지 로드
                      style={{
                        width: "100%",  // YouTube default 썸네일은 보통 120px × 90px
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
            <Next onClick={() => onClickToArrowBtn(1)} disabled={leaving}>
              &gt;
          </Next>
          </Slider>
        </SliderWrapper>
      )}
    </HomeYouTubeWapper>
  );
}

export default YouTubeMainVideo;

/* Styled Components */
const HomeYouTubeWapper = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto; // ✅ 자식 높이에 맞춰짐
`;

const SliderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: ${(props) => props.theme.headerWidth.default};
  position: relative;
  overflow: hidden;

  ${({ theme }) => theme.media.max1300} {
    width: ${({ theme }) => theme.headerWidth.responsive};
  }
`;


const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10vw 0;
    ${({ theme }) => theme.media.max1300} {
      padding: 20vw 0;
    }
  `;

const Slider = styled.div`
  display: flex;
  width: 100%;
  position: relative; 
  padding: 10vw 0;
  ${({ theme }) => theme.media.max1300} {
    padding: 20vw 0;
  }
`;

const Row = styled(motion.div)`
  display: flex;
  gap: 5px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start; /* ✅ 상단 정렬 */
  padding: 4vw;
`;

const Box = styled(motion.div)<{ offset: number }>`
  flex: 0 0 calc(100% / ${(props) => props.offset});
  box-sizing: border-box;
  position: relative;
    object-fit: cover;
  // ✅ 반응형 비율 유지
  aspect-ratio: 16 / 9; 

  img {
    width: 100%;
    height: auto;
    max-width: 70vw;   // 뷰포트 기준 최대 너비
    object-fit: cover; /* ✅ 이미지 크기 맞춤 */
    &:hover{
      z-index: 100;
    }
  }
   
`;

const Info = styled(motion.div)`
  padding: 10px;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 0.8vw;
    color: ${(props) => props.theme.textColor};
    ${({ theme }) => theme.media.max1300} {
      font-size: 1.5vw;
    }      
  }
`;
const Prev = styled.button`
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
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
`;

const Next = styled.button`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
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
`;