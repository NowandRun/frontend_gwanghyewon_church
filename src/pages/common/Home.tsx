import React from 'react';
import styled from 'styled-components';
import Mainbanner from '../../components/Home/MainBanner';
import Mainministry from '../../components/Home/MainMinistry';
import MainWorshipInformation from '../../components/Home/MainWorshipInformation';
import MainRecommendVideo from '../../components/Home/MainRecommendVidoe';
import MainScondNavigation from '../../components/Home/MainScondNavigation';

function Home() {
  return (
    <>
      <HomeWrapper>
        <Mainbanner />
        <Mainministry />
        <MainScondNavigation />
        <MainRecommendVideo />
        <MainWorshipInformation />
      </HomeWrapper>
    </>
  );
}

export default Home;

const HomeWrapper = styled.div`
  ${({ theme }) => theme.media.max1300} {
    padding-top: 100px; // 헤더 높이만큼 내려줌
  }
`;
