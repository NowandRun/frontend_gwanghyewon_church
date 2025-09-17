import React from 'react';
import styled from 'styled-components';
import Mainbanner from '../../components/Main-home/MainBanner';
import Mainministry from '../../components/Main-home/MainMinistry';
import MainWorshipInformation from '../../components/Main-home/MainWorshipInformation';
import MainRecommendVideo from '../../components/Main-home/MainRecommendVidoe';
import MainScondNavigation from '../../components/Main-home/MainScondNavigation';
import MainOfferingInformation from '../../components/Main-home/MainOfferingInformation';
import MainKaKaoMap from '../../components/Main-home/MainKaKaoMap';
import MainVisionStateMent from '../../components/Main-home/MainVisionStatement';

function Home() {
  return (
    <>
      <HomeWrapper>
        <Mainbanner />
        <Mainministry />
        <MainScondNavigation />
        <MainRecommendVideo />
        <MainWorshipInformation />
        <MainKaKaoMap />
        <MainVisionStateMent />
        <MainOfferingInformation />
      </HomeWrapper>
    </>
  );
}

export default Home;

const HomeWrapper = styled.div`
  ${({ theme }) => theme.media.tablet} {
    padding-top: 100px; // 헤더 높이만큼 내려줌
  }
`;
