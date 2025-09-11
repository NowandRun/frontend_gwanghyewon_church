import React, { useEffect } from 'react';
import styled from 'styled-components';
import KakaoMapView from '../../components/KaKaoMap/KaKaoMapView';
import { LOCATION_ADDRESS } from '../../types/constants';

const MainKaKaoMap = () => {
  const address = LOCATION_ADDRESS;

  return (
    <MainKaKaoMapWrapper>
      <KakaoMapInfo>
        <KaKaoMapTitleWrapper>
          <KaKaoMapTitle>오시는길</KaKaoMapTitle>
        </KaKaoMapTitleWrapper>
        <KaKaoMapAddressWrapper>
          <KaKaoMapAddress>{address}</KaKaoMapAddress>
        </KaKaoMapAddressWrapper>
      </KakaoMapInfo>
      <KakaoMapView
        webHeight="30vw"
        mobileHeight="60vw"
      />
    </MainKaKaoMapWrapper>
  );
};

export default MainKaKaoMap;

const MainKaKaoMapWrapper = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.media.desktop} {
    height: 100vh;
  }
  ${({ theme }) => theme.media.tablet} {
    padding: 10vw 0;
  }
  ${({ theme }) => theme.media.mobile} {
    padding: 12vw 0;
  }
`;

const KakaoMapInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1vw;
`;

const KaKaoMapTitleWrapper = styled.div`
  font-size: 3vw;
  padding-bottom: 1vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 4vw;
    padding-bottom: 1vw;
  }
`;

const KaKaoMapTitle = styled.span``;

const KaKaoMapAddressWrapper = styled.div`
  /* 수평 중앙 정렬하기 */
  text-align: center;
  font-size: 1.3vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.2vw;
    padding-bottom: 1vw;
  }
`;

const KaKaoMapAddress = styled.span``;
