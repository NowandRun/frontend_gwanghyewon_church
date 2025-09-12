import React, { useEffect } from 'react';
import styled from 'styled-components';
import KakaoMapView from '../../components/KaKaoMap/KaKaoMapView';
import { LOCATION_ADDRESS } from '../../types/constants';
import { MapPinLineIcon } from '@phosphor-icons/react/dist/ssr';

const MainKaKaoMap = () => {
  const address = LOCATION_ADDRESS;

  return (
    <MainKaKaoMapWrapper>
      <KakaoMapInfo>
        <KaKaoMapTitleWrapper>
          <KaKaoMapTitle>교회방문하기</KaKaoMapTitle>
        </KaKaoMapTitleWrapper>
        <KaKaoMapAddressWrapper>
          <KaKaoMapAddressIcon>
            <MapPinLineIcon />
          </KaKaoMapAddressIcon>
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
  font-size: 1.5vw;
  display: flex;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.5vw;
    padding-bottom: 1vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.5vw;
    padding-bottom: 1vw;
  }
`;

const KaKaoMapAddressIcon = styled.div`
  display: flex;
  align-items: end;
  font-size: 2.5vw;
  color: ${(props) => props.theme.accentColor};
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 4.5vw;
  }
`;

const KaKaoMapAddress = styled.span``;
