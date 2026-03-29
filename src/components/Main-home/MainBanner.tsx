import React from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { FaYoutube } from 'react-icons/fa'; // FaPlayCircle 대신 FaYoutube로 변경

// 문구 구성
const MAIN_TITLE = 'THE GWANGHYEWON';
const SUB_TITLE = 'THE ASSEMBLIES OF GOD OF KOREA';
const DESCRIPTION = '광혜원순복음교회 홈페이지에 오신 것을 환영합니다.';

function Mainbanner() {
  return (
    <VideoWrapper>
      <ReactPlayer
        url={process.env.PUBLIC_URL + '/videos/home_video_reencoded.mp4'}
        playing
        loop
        muted
        playsinline
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: {
              style: { objectFit: 'cover' },
              playsInline: true,
            },
          },
        }}
      />

      <OverlayContent>
        <TextGroup>
          <MainTitle>{MAIN_TITLE}</MainTitle>
          <SubTitle>{SUB_TITLE}</SubTitle>
          <Underline />
          <Description>{DESCRIPTION}</Description>
        </TextGroup>

        {/* PlayButton을 a 태그로 변경하여 링크 연결 */}
        <PlayButton
          as="a"
          href="https://www.youtube.com/@Mrssomman"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* FaYoutube 아이콘으로 변경 */}
          <FaYoutube className="youtube-icon" />
          <span>Play a Video</span>
        </PlayButton>
      </OverlayContent>
    </VideoWrapper>
  );
}

export default Mainbanner;

/* --- Styled Components --- */

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  height: 0;
  overflow: hidden;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
  }
`;
/* --- 수정된 Styled Components --- */

const OverlayContent = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  /* 반응형 너비 설정: 데스크탑 70%, 모바일 90% */
  width: 70%;
  @media (max-width: 768px) {
    width: 90%;
  }

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  z-index: 2;
  box-sizing: border-box;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-shadow: 0 0.2vw 1vw rgba(0, 0, 0, 0.5); /* 그림자도 반응형 단위 */
`;

const MainTitle = styled.h1`
  font-size: 5vw; /* 화면 너비에 따라 자동 조절 */
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.1vw;

  @media (max-width: 768px) {
    font-size: 8vw; /* 모바일에서는 조금 더 크게 */
  }
`;

const SubTitle = styled.h2`
  font-size: 3.5vw;
  font-weight: 300;
  margin: 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 5vw;
  }
`;

const Underline = styled.div`
  width: 15vw; /* 너비를 % 개념인 vw로 유지 */
  height: 0.3vw; /* 높이도 반응형으로 조절 */
  min-height: 1px;
  background-color: white;
  margin: 2vw 0; /* 간격을 % 개념으로 설정 */
`;

const Description = styled.p`
  font-size: 1.2vw;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 3vw; /* 모바일 가독성을 위해 크기 조정 */
    margin-bottom: 2vw;
  }
`;

const PlayButton = styled.a`
  display: flex;
  align-items: center;
  margin-top: 3vw; /* 간격을 vw로 설정 */
  cursor: pointer;
  transition: opacity 0.3s;
  text-decoration: none;
  color: inherit;
  width: fit-content;

  &:hover {
    opacity: 0.7;
  }

  .youtube-icon {
    font-size: 3vw; /* 아이콘 크기도 반응형 */
    margin-right: 1vw;

    @media (max-width: 768px) {
      font-size: 6vw;
    }
  }

  span {
    font-size: 1.2vw; /* 글자 크기 반응형 */
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 3.5vw;
    }
  }
`;
