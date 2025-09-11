import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Video } from '../../types/types';
import {
  fetchLatestVideosFromMainSundayWorshipPlaylists,
  fetchLatestVideosFromMainFridayWorshipPlaylists,
} from '../../types/youtube-api';
import Slider from '../../components/Slider/Slider';
import { ClockLoader } from 'react-spinners';
import useWindowDimensions from '../../components/useWindowDimensions';

function MainRecommendVideo() {
  const windowWidth = useWindowDimensions();
  const spinnerSize = Math.round(windowWidth * 0.06); // 70vw, 소수점 반올림

  const { data: latestSundayWorshipVideos, isLoading: isSundayWorshipLoading } = useQuery<Video[]>(
    ['latestSundayWorshipVideosMain'],
    fetchLatestVideosFromMainSundayWorshipPlaylists,
  );

  const { data: latestFridayWorshipVideos, isLoading: isFridayWorshipLoading } = useQuery<Video[]>(
    ['latestFridayWorshipVideosMain'],
    fetchLatestVideosFromMainFridayWorshipPlaylists,
  );
  return (
    <HomeLatestRecommendVideoWrapper>
      <HomeLatestRecommendVideoControl>
        {isSundayWorshipLoading || isFridayWorshipLoading ? (
          <HomeLatestRecommendVideoLoading>
            <ClockLoader
              size={spinnerSize}
              color="#ffffff"
            />
          </HomeLatestRecommendVideoLoading>
        ) : (
          <>
            <Slider
              title="주일오전설교"
              data={latestSundayWorshipVideos ?? []}
            />
            <Slider
              title="금요성령집회"
              data={latestFridayWorshipVideos ?? []}
            />
          </>
        )}
      </HomeLatestRecommendVideoControl>
    </HomeLatestRecommendVideoWrapper>
  );
}

export default MainRecommendVideo;

const HomeLatestRecommendVideoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.cardBgColor};
  height: 30vw;
  ${({ theme }) => theme.media.tablet} {
    height: 55vw;
  }

  ${({ theme }) => theme.media.mobile} {
    height: 80vw;
  }
`;

const HomeLatestRecommendVideoControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: ${(props) => props.theme.headerWidth.default};
  ${({ theme }) => theme.media.tablet} {
    width: ${(props) => props.theme.headerWidth.responsive};
  }
`;

const HomeLatestRecommendVideoLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.media.tablet} {
    height: 70vw;
  }
`;
