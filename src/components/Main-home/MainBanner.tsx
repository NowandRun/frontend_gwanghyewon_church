import React from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { mainVidoeTopText } from '../Navicaton';

function Mainbanner() {
  return (
    <VideoWrapper>
      <ReactPlayer
        url={process.env.PUBLIC_URL + '/videos/home_video_reencoded.mp4'}
        playing
        loop
        muted
        width="100%"
        height="100%"
        config={{
          file: { attributes: { style: { objectFit: 'cover' } } },
        }}
      />
      <OverlayText>
        {mainVidoeTopText.split('\n').map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </OverlayText>
    </VideoWrapper>
  );
}

export default Mainbanner;
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
    box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.3);
    filter: brightness(0.85);
  }
  iframe,
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ${({ theme }) => theme.media.tablet} {
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
  font-size: 4vw;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
  z-index: 2;
`;
