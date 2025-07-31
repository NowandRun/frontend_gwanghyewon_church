import React, { useState } from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT} from '../../components/Header/Header'
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";
import { ChurchIcon, CrossIcon, GlobeHemisphereEastIcon, HandHeartIcon, CalendarCheckIcon, FilesIcon, YoutubeLogoIcon, MonitorArrowUpIcon } from "@phosphor-icons/react";
import CircularGallery from '../../Style/CircularGallery'
import {motion, AnimatePresence} from 'framer-motion';
import useWindowDimensions from "../../components/useWindowDimensions";


const text = `환영합니다!\n광혜원순복음교회입니다.`;

const ministryItems = [
  {
    title: '교회소개',
    icon: <ChurchIcon />, 
    description: [
      '하나님과 함께하는',
      '행복한 교회를',
      '소개합니다.'  
    ],
    href: '/info'
  },
  {
    title: '교회학교',
    icon: <CrossIcon />,
    description: [
      '다음세대가', 
      '성장하는', 
      '교회학교입니다.'
    ],
    href: '/youth'
  },
  {
    title: 'GS방송',
    icon: <GlobeHemisphereEastIcon />,
    description: [
      'GS방송은', 
      '말씀과 함께 성장하는', 
      '온라인 방송입니다.'
    ],
    href: '/broadcast'
  },
  {
    title: '새가족',
    icon: <HandHeartIcon />,
    description: [
      '환영합니다',
      '축복합니다',
      '사랑합니다.'
    ],
    href: '/group'
  },
];

const HomeSecondNavItems = [
  {
    title: '예배안내',
    icon: <CalendarCheckIcon />, 
    href: '/info'
  },
  {
    title: '교회주보',
    icon: <FilesIcon />,
    href: '/youth'
  },
  {
    title: '유튜브채널',
    icon: <YoutubeLogoIcon />,
    href: 'https://www.youtube.com/@Mrssomman'
  },
  {
    title: '온라인행정',
    icon: <MonitorArrowUpIcon />,
    href: '/group'
  },
];

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Home() {
/*   const [list, setList] = useState(items);
  const [currentIndex, setCurrentIndex] = useState(0); // 중앙 박스 인
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const next = () => {
    setDirection('next');
    setList((prev) => {
      const newList = [...prev.slice(1), prev[0]]; // 왼쪽으로 shift
      return newList;
    });
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setDirection('prev');
    setList((prev) => {
      const newList = [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
      return newList;
    });
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }; */
  return (
    <>
      <HomeWrapper>
        <VideoWrapper >
          <ReactPlayer
          url="https://youtu.be/AmL1_7F3GDA"
          playing
          loop
          muted
          controls={false}
          width="100%"
          height={`calc(100vh - ${HEADER_HEIGHT}px)`}
        />
          <OverlayText>
            {text.split('\n').map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </OverlayText>
        </VideoWrapper>

        <MinistryContainer >
          <MinistryController>
            {ministryItems.map((item, index) => (
              <MinistryCard key={index} to={item.href}>
                <Title>{item.title}</Title>
                <Icon>{item.icon}</Icon>
                <Description>
                  {item.description.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Description>
              </MinistryCard>
            ))}
          </MinistryController>
        </MinistryContainer>

        <HomeSecondNav>
          <HomeSecondNavOne>
          
          </HomeSecondNavOne>
          <HomeSecondNavTwo>
            <HomeSecondNavTwoController>
            {HomeSecondNavItems.map((items, index) => (
              <HomeSecondNavTwoCard key={index} to={items.href}>
                <HomeSecondNavTwoIcon>
                  {items.icon}
                </HomeSecondNavTwoIcon>
                <HomeSecondNavTwoTitle>
                  {items.title}
                </HomeSecondNavTwoTitle>
              </HomeSecondNavTwoCard>
            ))}
            </HomeSecondNavTwoController>
          </HomeSecondNavTwo>
        </HomeSecondNav>
      </HomeWrapper>
      {/* <div style={{ height: '600px', position: 'relative' }}>
        <CircularGallery bend={0} textColor="black" borderRadius={0.02} scrollEase={0.02}  />
      </div> */}
      {/* <Slider>
        <Row currentIndex={currentIndex}>
          {list.map((item, index) => (
            <Box
              key={item}
              isActive={index === 0} // 항상 첫 번째 요소를 커지게
            >
              {item}
            </Box>
          ))}
        </Row>
      </Slider>
      <BoxMover>
          <Prev onClick={prev}>Prev</Prev>
          <Next onClick={next}>Next</Next>
        </BoxMover> */}

    </>
  );
}

export default Home;

const HomeWrapper = styled.div`
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 비율 = 9 / 16 * 100 */
  height: 0;
  pointer-events: none; /* Hover 이벤트 차단 */
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    filter: brightness(0.85);
  }
  iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }


  ${({theme}) => theme.media.max1300} {
  top: 0;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
  z-index: 2;

  ${({theme}) => theme.media.max1300} {
    font-size: 1.6rem;
  }
`;



const MinistryContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.cardBgColor};
  transition: background-color 1s;
  padding-top: 4rem;
  padding-bottom: 4rem;
  
`;

const MinistryController = styled.div`
  width: ${({theme}) => theme.headerWidth.default};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  flex-direction: row; /* ✅ 가로 정렬 */
  ${({ theme }) => theme.media.max1300} {
    width: ${({ theme }) => theme.headerWidth.responsive};
    display: flex;
    flex-wrap: nowrap; /* ✅ 줄바꿈 방지 */
    flex-direction: row; /* ✅ 가로 정렬 */
    align-items: center;
    justify-content: space-between; /* ✅ 가로 공간 확보 */
    padding: 0;
    gap: 0.1rem; /* gap 줄이면 더 조밀하게 정렬 가능 */
  }
`

const MinistryCard = styled(Link)`
  flex: 1 1 22%;
  background: transparent;
  text-align: center;
  color: ${(props) => props.theme.textColor};
  transition: color 1s;
  padding: 1rem;

  border-right: 1px solid rgba(255, 255, 255, 0.4);

  &:last-child {
    border-right: none;
  }

  ${({theme}) => theme.media.max1300}{
    flex: 1 1 100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.3rem;
  }
`;

const Icon = styled.div`
  font-size: 5rem;
  ${({theme}) => theme.media.max1300}{
    font-size: 3rem;
  }
`;

const Title = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  ${({theme}) => theme.media.max1300}{
    font-size: 1rem;
    font-weight: bold;
  }
`;

const Description = styled.p`
  font-size: 1.4rem;
  -webkit-box-orient: vertical;
  ${({theme}) => theme.media.max1300}{
    font-size: 0.7rem;
    font-weight: bold;
  }
`;

const Slider = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: flex-end;
  background-color: ${(props) => props.theme.cardBgColor};

`;

const Row = styled(motion.div)<{ currentIndex: number }>`
  display: flex;
  align-items: flex-end;
  transition: transform 0.5s ease-in-out;
  padding-bottom: 50px;
`;

const Box = styled.div<{ isActive: boolean }>`
  flex: 0 0 auto;
  width: ${({ isActive }) => (isActive ? '800px' : '500px')};
  height: ${({ isActive }) => (isActive ? '800px' : '500px')};
  margin: 0 10px;
  background-color: white;
  font-size: ${({ isActive }) => (isActive ? '5rem' : '3rem')};
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${({ isActive }) =>
    isActive &&
    `
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  `}
`;

const BoxMover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  gap: 1rem;
`;

const Prev = styled.button`
  padding: 0.5rem 1rem;
`;

const Next = styled.button`
  padding: 0.5rem 1rem;
`;

const HomeSecondNav = styled.div`
  height: 700px;
  display: flex;
`
const HomeSecondNavOne = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  display: flex;

  `

  const HomeSecondNavTwo = styled.div`
    height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #D8D2C2;
  `

  const HomeSecondNavTwoController = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 가로 2칸
  grid-template-rows: repeat(2, 1fr);    // 세로 2칸
  height: 80%;
  width: 80%;
  padding-right: 21rem;
`

  const HomeSecondNavTwoCard = styled(Link)`
display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  `

  const HomeSecondNavTwoIcon = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
height: 120Px;
  width: 120Px;
    font-size: 5rem;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  `

  const HomeSecondNavTwoTitle = styled.h3`
   font-size: 1.5rem;
  font-weight: bold;
  `

