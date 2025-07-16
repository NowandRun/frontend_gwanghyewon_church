import React from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT} from '../../components/Header/Header'
import ReactPlayer from 'react-player';
import { Link } from "react-router-dom";

const text = `환영합니다!\n광혜원순복음교회입니다.`;

const ministryItems = [
  {
    title: '교회소개',
    icon: '💖', // 혹은 <img src="/..." />
    description: '성도 한 사람 한 사람의 육체와 영혼을 모두 아우르는 ‘위드 성도 케어’',
    href: '/page1'
  },
  {
    title: '교회학교',
    icon: '🕊️',
    description: '새에덴교회 참전용사 초청행사는 마지막 한 분의 참전용사가 살아 계실 때까지 계속됩니다',
    href: '/page1'
  },
  {
    title: 'GS방송',
    icon: '🖐️',
    description: '하나님을 사랑하고, 이웃과 나라와 민족을 섬기는 예배자를 세웁니다',
    href: '/page1'
  },
  {
    title: '새가족',
    icon: '📖',
    description: '4-7세 대상으로 평일 쉐마 말씀교육을 통해 예수님을 가르치고 작은선교사를 키우는 교육공동체',
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
          {ministryItems.map((item, index) => (
            <MinistryCard key={index} to={item.href}>
              <Icon>{item.icon}</Icon>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
            </MinistryCard>
          ))}
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

position: relative ; /* 절대 위치로 설정하여 다른 내용에 영향 미치지 않도록 함 */
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;


  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;

  padding-top: 2rem;
  padding-bottom: 2rem;
  

  background-color: #3498a3; /* 이미지 배경색과 비슷하게 */

  ${({theme}) => theme.media.max1300} {
    display: flex;
    flex-direction: row; /* 가로 정렬 명시 */
    align-items: center;
    padding: 0;
  }
`;

const MinistryCard = styled(Link)`
  flex: 1 1 22%;
  min-width: 250px;
  background: transparent;
  text-align: center;
  color: white;
  padding: 1rem;

  border-right: 1px solid rgba(255, 255, 255, 0.4);

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;