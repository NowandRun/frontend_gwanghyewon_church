import React, { useState } from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT} from '../../components/Header/Header'
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";
import { ChurchIcon, ChartLineUpIcon,CrossIcon, GlobeHemisphereEastIcon, HandHeartIcon, HeartbeatIcon, CalendarCheckIcon, FilesIcon, YoutubeLogoIcon, MonitorArrowUpIcon } from "@phosphor-icons/react";
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
    title: '양육',
    icon: <ChartLineUpIcon />, 
    href: '/group/nurture'
  },
  {
    title: '봉사',
    icon: <HeartbeatIcon />, 
    href: '/group/ministration'
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
            <HomeSecondNavEmtyController />
          </HomeSecondNavTwo>
        </HomeSecondNav>
        <HomeWorshipInformation>
          <Wrapper>
            <Section>
              <WorshipInformationtitle>주일예배</WorshipInformationtitle>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>1부 예배 오전 9시</Item>
                <Item>2부 예배 오전 11시</Item>
                <Item>바이블아카데미 오후 1시 30분</Item>
              </List>
            </Section>

            <Section>
              <WorshipInformationtitle>수요 및 금요성령집회</WorshipInformationtitle>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>수요예배 저녁 7시 30분</Item>
                <Item>금요성령집회 저녁 8시 30분</Item>
              </List>
            </Section>

            <Section>
              <WorshipInformationtitle>새벽기도회</WorshipInformationtitle>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>월~금 매주 새벽 5시</Item>
              </List>
            </Section>

            <Section>
              <WorshipInformationtitle>교회학교</WorshipInformationtitle>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>2층 하꿈예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>하꿈주일학교 오전 10시 40분</Item>
              </List>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>2층 예람예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>예람학생부 오후 1시 20분</Item>
              </List>
              <WorshipInformationPlace>
                <WorshipInformationPlaceName>2층 하람예배실</WorshipInformationPlaceName>
              </WorshipInformationPlace>
              <List>
                <Item>하람청년부 오후 1시 20분</Item>
              </List>
            </Section>

          </Wrapper>
        </HomeWorshipInformation>
      </HomeWrapper>
      {/* <Slider>
        <Row currentIndex={currentIndex}>
          {videoList.map((video, index) => (
            <Box key={video.id} isActive={index === 0}>
              <ReactPlayer url={`https://www.youtube.com/watch?v=${video.id}`} width="100%" height="100%" />
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
  ${({theme}) => theme.media.max1300} {
      padding-top: 120px; // 헤더 높이만큼 내려줌
  }
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
  };
  iframe, video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  };


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
  ${({theme}) => theme.media.max1300}{
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
  }
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
    padding: 1rem 0;
    gap: 0.1rem; /* gap 줄이면 더 조밀하게 정렬 가능 */
  }
`

const MinistryCard = styled(Link)`
  flex: 1 1 22%;
  background: transparent;
  text-align: center;
  color: ${(props) => props.theme.textColor};
  transition: color 1s ease;
  padding: 1rem;

  border-right: 1px solid rgba(255, 255, 255, 0.4);

  &:last-child {
    border-right: none;
  }

  ${({theme}) => theme.media.max1300}{
    flex: 1 1 100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.3rem;
     };
`;

const Icon = styled.div`
  font-size: 5rem;
  ${({theme}) => theme.media.max1300}{
    font-size: 2rem;
  }
`;

const Title = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  ${({theme}) => theme.media.max1300}{
    font-size: 0.9rem;
    font-weight: bold;
  }
`;

const Description = styled.p`
  font-size: 1.4rem;
  -webkit-box-orient: vertical;
  ${({theme}) => theme.media.max1300}{
    font-size: 0.65rem;
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
  height: 46rem;
  display: flex;
  ${({theme}) => theme.media.max1300}{
    height: 15rem;
  };
`
const HomeSecondNavOne = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  ${({theme}) => theme.media.max1300}{
    height: 100%;
  width: 50%;
  }
  `

  const HomeSecondNavTwo = styled.div`
    height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #D8D2C2;
  position: relative; // ✅ 추가
  ${({theme}) => theme.media.max1300}{
    height: 100%;
    width: 70%;
  }
  `

  const HomeSecondNavTwoController = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  height: 70%;
  position: absolute;
  left: 0;
  gap: 0.1rem; /* ✅ 카드 간격 추가 */
  
  ${({theme}) => theme.media.max1300}{
    padding: 0;
    width: 100%;
    height: 70%;
    position: static;

  };
`



const HomeSecondNavEmtyController = styled.div`
  width: 30%;
  height: 100%;
  right: 0;
  position: absolute; // ✅ 추가
  ${({theme}) => theme.media.max1300}{
    height: 0;
    width: 0;
  };
`

  const HomeSecondNavTwoCard = styled(Link)`
display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(33.33% - 1rem); // 3개씩 정렬
  height: 50%; // 총 높이의 반 (2줄)
  text-align: center;
  margin-left: 0.9rem;
  ${({theme}) => theme.media.max1300} {
    width: 25%;
    height: 50%;
    margin: 0 0.8rem;
  }
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
    color: ${(props) => props.theme.textColor};
    transition: color 1s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
        ${({theme}) => theme.media.max1300}{
        height: 50px;
        width: 50px;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
  `

  const HomeSecondNavTwoTitle = styled.h3`
   font-size: 1.5rem;
   font-weight: bold;
   color: ${(props) => props.theme.textColor};
   transition: color 1s;
   ${({theme}) => theme.media.max1300}{
       font-size: 0.6rem;
   }
  `

  const HomeWorshipInformation = styled.section`
    background: ${(props) => props.theme.bgColor};
    padding: 4rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  const Wrapper = styled.div`
    width: 70%;
    margin: 0 auto;
    padding: 2rem;
    display: flex;        /* ✅ flex 추가 */
    gap: 2rem;            /* ✅ 섹션 사이 간격 */
    justify-content: space-between; /* ✅ 양쪽 정렬 */
    ${({theme}) => theme.media.max1300}{
      width: 100%;
      gap: 1rem;  
      padding: 1rem;
    }
  `;

  const Section = styled.section`
    margin-bottom: 2.5rem;
     width: 100%;

  `;

  const WorshipInformationtitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.3rem;
    text-align: center;
    ${({theme}) => theme.media.max1300}{
      font-size: 0.75rem;
      padding-bottom: 0.1rem;
      margin-bottom: 0.5rem;
    }
  `;

  const WorshipInformationPlace = styled.div`
    width: 100%;
    height: 2rem;
    background-color:${(props) => props.theme.cardBgColor}; 
    display: flex; 
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    margin-bottom: 0.5rem;
   
  `
  const WorshipInformationPlaceName = styled.p`
  font-size: 1.2rem;
  ${({theme}) => theme.media.max1300}{
    font-size: 0.7rem;
  }
  `

  const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
  `;

  const Item = styled.li`
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: #444;
    ${({theme}) => theme.media.max1300}{
      font-size: 0.7rem;
    }
  `;
