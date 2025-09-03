import React, { useState, useEffect } from "react";
import useYouTubeChannelInfo from "./YouTubeData";
import { Playlist, Video } from "../../types/types";
import styled from 'styled-components';
import {motion, AnimatePresence} from 'framer-motion';
import ReactPlayer from 'react-player';


function YouTubeMainVideo() {
  	const [currentIndex, setCurrentIndex] = useState(0); // 중앙 박스 인

	  const [list, setList] = useYouTubeChannelInfo();

	  const [direction, setDirection] = useState<'next' | 'prev'>('next');
	  const chunkSize = 4; // 한 묶음에 보여줄 영상 개수
	  const next = () => {
		setDirection('next');
		setCurrentIndex(prev =>
		  (prev + chunkSize) % (list[3]?.videos?.length || 1)
		);
	  };
	
	  const prev = () => {
		setDirection('prev');
		setCurrentIndex(prev =>
		  (prev - chunkSize + (list[3]?.videos?.length || 1)) %
		  (list[3]?.videos?.length || 1)
		);
	  };



	useEffect(() => {
		console.log("플레이리스트:", list);
	  }, [list]);
	
	  if (!list.length) {
		return <div>Loading...</div>;
	  }
// 현재 보여줄 4개 묶음 계산
	const videosToShow = list[3].videos?.slice(
		currentIndex,
		currentIndex + chunkSize
	);

	const rowVariants = {
		enter: (dir: number) => ({
		  x: dir > 0 ? '100%' : '-100%',
		  opacity: 0,
		}),
		center: {
		  x: 0,
		  opacity: 1,
		  transition: { type: 'spring', stiffness: 300, damping: 30 },
		},
		exit: (dir: number) => ({
		  x: dir < 0 ? '100%' : '-100%',
		  opacity: 0,
		  transition: { type: 'spring', stiffness: 300, damping: 30 },
		}),
	  };
	return (
		<>
		  <HomeYouTubeWapper>
			<Slider>
				<AnimatePresence custom={direction}>
				<Row
					key={currentIndex} // currentIndex가 바뀌면 AnimatePresence가 새 Row로 처리
					custom={direction === "next" ? 1 : -1}
					variants={rowVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ type: "tween", duration: 0.5 }}
				>
					{videosToShow?.map((playlist) => (
					<Box
						key={playlist.id}
						whileHover={{ scale: 1.05 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						{playlist.snippet ? (
						<img
							src={
							playlist.snippet.thumbnails?.medium?.url ||
							playlist.snippet.thumbnails?.default?.url ||
							""
							}
							alt={playlist.snippet.title}
						/>
						) : (
						<div>영상 없음</div>
						)}
						<HomeSundayWorshipTitleWrapper>
						<HomeSundayWorshipTitle>
							{playlist.snippet.title}
						</HomeSundayWorshipTitle>
						</HomeSundayWorshipTitleWrapper>
					</Box>
					))}
				</Row>
				</AnimatePresence>
			</Slider>
		
				<BoxMover>
					<Prev onClick={prev}>Prev</Prev>
					<Next onClick={next}>Next</Next>
				</BoxMover>
		  </HomeYouTubeWapper>
		</>
	  );
	}
	
	export default YouTubeMainVideo;

const HomeYouTubeWapper = styled.div`
background-color: ${(props) => props.theme.cardBgColor};

  position: static;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const Slider = styled.div`
  width: ${(props) => props.theme.headerWidth.default};
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  transform: translateX(0);
`;

const Box = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  img {
    border-radius: 5px;
    margin-bottom: 0.5rem;
  }
`;

const HomeSundayWorshipTitleWrapper = styled.div`
  text-align: center;
`;

const HomeSundayWorshipTitle = styled.h3`
  font-size: 1rem;
  color: black;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  padding: 2px 5px;
  overflow: hidden;
`;

const BoxMover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Prev = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #eee;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
`;

const Next = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: #eee;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
`;

