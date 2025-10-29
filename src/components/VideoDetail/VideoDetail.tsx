import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

function VideoDetail() {
  const location = useLocation();
  const { video, sectionName } = location.state || {};

  return (
    <VideoDetailWrapper>
      <VideoDetailTitle>{sectionName}</VideoDetailTitle>
      {video ? (
        <>
          <ResponsiveIframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.snippet.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <VideoDetailText>{video.snippet.title}</VideoDetailText>
        </>
      ) : (
        <p>해당 영상을 불러올 수 없습니다.</p>
      )}
    </VideoDetailWrapper>
  );
}

export default VideoDetail;

const VideoDetailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    position: static;
  }
`;

const VideoDetailTitle = styled.div`
  font-size: 1.5vw;
  height: 3vw;
  padding: 2vw 0;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.media.tablet} {
    height: 4vw; /* 예: 60px 고정 */
    padding: 3vw 0;
    font-size: 3vw;
  }
`;

const ResponsiveIframe = styled.iframe`
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* 유튜브 기본 비율 */
  border: none;
  border-radius: 10px;
  margin: 1rem 0;

  ${({ theme }) => theme.media.mobile} {
    aspect-ratio: auto; /* 필요 시 모바일에 맞게 조정 가능 */
  }
`;

const VideoDetailText = styled.p`
  font-size: 1.1vw;
  font-weight: 600;

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.4vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 1.8vw;
  }
`;
