import React from 'react';
import styled from 'styled-components';
import KakaoMapGeocode from '../../../../components/KaKaoMap/KaKaoMapView';
import { LOCATION_ADDRESS } from '../../../../types/constants';
import { MapPinLineIcon } from '@phosphor-icons/react';

function Location() {
  return (
    <LocationWrapper>
      <LocationTitle>찾아오시는 길</LocationTitle>
      <KakaoMapGeocode
        webWidth="100%"
        webHeight="30vw"
        mobileHeight="40vw"
        mobileWidth="100%"
        tabletWidth="100%"
        tabletHeight="35vw"
      />
      <LocationAddressWrapper>
        <MapPinLineIcon />
        <LocationAddressText>{LOCATION_ADDRESS}</LocationAddressText>
      </LocationAddressWrapper>
    </LocationWrapper>
  );
}

export default Location;

const LocationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }

  ${({ theme }) => theme.media.mobile} {
    position: static; /* ✅ sticky로 변경 */
  }
`;
const LocationTitle = styled.div`
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

const LocationAddressWrapper = styled.div`
  width: 100%;
  height: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  font-size: 1.8vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3vw;
  }
`;

const LocationAddressText = styled.p`
  margin-left: 0.5vw;
`;
