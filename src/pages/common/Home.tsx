import React from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT} from '../../components/Header/Header'
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";
import { ChurchIcon, CrossIcon, GlobeHemisphereEastIcon, HandHeartIcon } from "@phosphor-icons/react";
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
    href: '/page1'
  },
  {
    title: '교회학교',
    icon: <CrossIcon />,
    description: [
      '다음세대가', 
      '성장하는', 
      '교회학교입니다.'
    ],
    href: '/page1'
  },
  {
    title: 'GS방송',
    icon: <GlobeHemisphereEastIcon />,
    description: [
      'GS방송은', 
      '말씀과 함께 성장하는', 
      '온라인 방송입니다.'
    ],
    href: '/page1'
  },
  {
    title: '새가족',
    icon: <HandHeartIcon />,
    description: [
      '환영하고',
      '축복하고',
      '사랑합니다.'
    ],
    href: '/page1'
  },
];

function Home() {
  return (
    <>
      <HomeWrapper>
        <VideoWrapper>
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

        <MinistryContainer>
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
      </HomeWrapper>
    </>
  );
}

export default Home;


const HomeWrapper = styled.div`

`

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