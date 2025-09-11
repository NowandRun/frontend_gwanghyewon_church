import React, { useEffect } from 'react';
import styled from 'styled-components';
import { LOCATION_ADDRESS } from '../../types/constants';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  webWidth?: string; // div width, default 100%
  webHeight?: string; // div height, default 400px
  tabletWidth?: string;
  tabletHeight?: string;
  mobileWidth?: string;
  mobileHeight?: string;
  level?: number; // 지도 확대 레벨, default 3
}

const KakaoMapGeocode: React.FC<KakaoMapProps> = ({
  webWidth = '70vw',
  webHeight = '400px',
  tabletWidth = '100vw',
  tabletHeight = '50vw',
  mobileWidth = '100vw',
  mobileHeight = '5vw',
  level = 2,
}) => {
  const address = LOCATION_ADDRESS;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');

        const isMobile = window.innerWidth <= 1150;
        const mapLevel = isMobile ? 3 : level;

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소 → 좌표 변환 후 지도 생성
        geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = result[0].y;
            const lng = result[0].x;
            const coords = new window.kakao.maps.LatLng(lat, lng);

            const map = new window.kakao.maps.Map(container, {
              center: coords, // 바로 주소 좌표로 중심 설정
              level: mapLevel,
            });

            // ZoomControl 추가 (모바일이 아닐 때만)
            if (!isMobile) {
              const zoomControl = new window.kakao.maps.ZoomControl();
              map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

              // MapTypeControl 추가
              const mapTypeControl = new window.kakao.maps.MapTypeControl();
              map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
            }

            // 마커 표시
            new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });
          } else {
            console.error('주소 검색 실패:', status);
          }
        });
      });
    };
  }, []);

  return (
    <KaKaoMapWapper>
      <MapContainer
        id="map"
        webWidth={webWidth}
        webHeight={webHeight}
        mobileWidth={mobileWidth}
        mobileHeight={mobileHeight}
        tabletWidth={tabletWidth}
        tabletHeight={tabletHeight}
      />
    </KaKaoMapWapper>
  );
};

export default KakaoMapGeocode;

interface MapContainerProps {
  webWidth: string;
  webHeight: string;
  mobileWidth: string;
  mobileHeight: string;
  tabletWidth: string;
  tabletHeight: string;
}

const KaKaoMapWapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MapContainer = styled.div<MapContainerProps>`
  width: ${(props) => props.webWidth};
  height: ${(props) => props.webHeight};

  ${({ theme }) => theme.media.tablet} {
    width: ${(props) => props.tabletWidth};
    height: ${(props) => props.tabletHeight};
  }

  ${({ theme }) => theme.media.mobile} {
    width: ${(props) => props.mobileWidth};
    height: ${(props) => props.mobileHeight};
  }
`;
