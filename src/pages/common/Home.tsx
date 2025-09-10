import React from 'react';
import styled from 'styled-components';
import Mainbanner from '../../components/Home/MainBanner';
import Mainministry from '../../components/Home/MainMinistry';
import MainWorshipInformation from '../../components/Home/MainWorshipInformation';
import MainRecommendVideo from '../../components/Home/MainRecommendVidoe';
import MainScondNavigation from '../../components/Home/MainScondNavigation';
import MainOfferingInformation from '../../components/Home/MainOfferingInformation';
import KakaoMapView from '../../components/NaverMap/KaKaoMapView';

function Home() {
  return (
    <>
      <HomeWrapper>
        <Mainbanner />
        <Mainministry />
        <MainScondNavigation />
        <MainRecommendVideo />
        <MainWorshipInformation />
        <MainOfferingInformation />
        <KakaoMapView
          webHeight="40vw"
          mobileHeight="60vw"
        />
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
