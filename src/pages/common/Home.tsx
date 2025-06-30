import React from 'react';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '../../components/Header/Header'
import ReactPlayer from 'react-player';

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
      </VideoWrapper>

      <Container>
        <p>여기는 본문 내용입니다.</p>
        <p>영상 아래에 들어가는 콘텐츠입니다.</p>
      </Container>
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

const Container = styled.div`
  margin-top: 20px;
  padding: 0 16px;
`;