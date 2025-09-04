import React, { useState, useRef, useEffect } from "react";
import { fetchYouTubeChannelInfo } from "../../types/api";
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from "react-query";
import { IGetPlaylist } from "../../types/types";
import useWindowDimensions from "../../components/useWindowDimensions";



const boxVariants = {
  normal: { scale: 1 },
  hover: { scale: 1.2, y: -20, transition: { duration: 0.3 } },
};

const infoVariants = {
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

const offset = 4;


function YouTubeMainVideo() {
  const { data, isLoading } = useQuery<IGetPlaylist[]>(
    ["sundayWorshipVideos", "fridayWorshipVideos"],
    fetchYouTubeChannelInfo
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const windowWidth = useWindowDimensions();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(windowWidth);

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
  const toggleLeaving = () => setLeaving(prev => !prev);

  const increaseIndex = () => {
	if (!data || leaving) return;
	toggleLeaving();
  
	const totalVideos = data[3]?.videos?.length || 0;
	const maxIndex = Math.ceil(totalVideos / offset) - 1;
	setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
  };

    // 화면 너비 기준 조건부 slideDistance 계산
	const slideDistance = sliderWidth * (windowWidth > 1300 ? 0.7 : 1) + 45;

  // 현재 슬라이드에 보여줄 비디오 배열
  const currentVideos = data?.[3]?.videos?.slice(offset * index, offset * index + offset) || [];
  return (
    <HomeYouTubeWapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SliderWrapper >
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
			<Row
				initial={{ x: slideDistance}}
				animate={{ x: 0 }}
				exit={{ x: -slideDistance }}
				transition={{ type: "tween", duration: 1 }}
				key={index}
			>
			{currentVideos.map(video => (
				<Box key={video.id} variants={boxVariants} initial="normal" whileHover="hover" offset={offset}>
					<img src={video.snippet.thumbnails?.medium?.url} alt={video.snippet.title} />
					<Info variants={infoVariants}>
					<h4>{video.snippet.title}</h4>
					</Info>
				</Box>
			))}
			</Row>
            </AnimatePresence>
          </Slider>
          <Next onClick={increaseIndex}>Next</Next>
        </SliderWrapper>
      )}
    </HomeYouTubeWapper>
  );
}

export default YouTubeMainVideo;

// Styled Components
const HomeYouTubeWapper = styled.div`
	display: flex;
    justify-content: center;
    align-items: center;

  `;

  const SliderWrapper = styled.div`
  display: flex;
  justify-content: flex-start; // Row가 flex-start 기준으로 이동
  align-items: center;
  background-color: red;
  width: ${(props) => props.theme.headerWidth.default};
  height: 25vw;
  position: relative; // Row가 absolute일 경우 필요
  overflow: hidden;   // 슬라이드 넘침 숨김
  ${({ theme }) => theme.media.max1300} {
	width: ${({ theme }) => theme.headerWidth.responsive};
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

`;


const Row = styled(motion.div)`
  display: flex;
  gap: 5px;
  position: absolute; // animate 할 때 absolute 필요
  left: 0;
  top: 0;
  width: 100%;
  justify-content: flex-start; // 중앙 정렬 → 왼쪽 정렬
  align-items: center;
  margin: 5vw 0 ;

`;
const Box = styled(motion.div)<{offset:number}>`
  flex: 0 0 calc(100% / ${props => props.offset}); // 화면 꽉 채움
  height: 200px;
  background-size: cover;
  background-position: center center;
  position: relative;

  img {
    width: 100%;
    object-fit: cover;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Next = styled.button`
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
`;
