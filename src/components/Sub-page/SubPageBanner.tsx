import React from 'react';
import styled from 'styled-components';

const SubPageBanner = () => {
  return (
    <SubPageBannerWapper>
      <SubPageBannerImage
        src={process.env.PUBLIC_URL + '/images/SubPage/250923-SubPage-배너-담임목사-사진.png'}
      />
    </SubPageBannerWapper>
  );
};

export default SubPageBanner;

const SubPageBannerWapper = styled.div`
  height: 28vw;
  overflow: hidden;
  position: relative; /* 자식 이미지 절대 위치 기준 */
  background-color: #cfab8d; /* e5d0ac, ffcf9d, eef7ff, 0084ff, 234C6A, 6B3F69, FA812F, 59AC77, 3A6F43, A8FBD3, F8F7BA, FFE797, 91ADC8, F75270, 48B3AF */

  /* ✅ 반투명 오버레이 */
  &::after {
    content: '';
    position: absolute;
    inset: 0; /* top, right, bottom, left = 0 */
    background-color: inherit; /* 부모 배경색 따라감 */
    opacity: 0.25; /* ✅ 투명도 조절 */
    pointer-events: none; /* 클릭 이벤트 안 막도록 */
  }
`;

const SubPageBannerImage = styled.img`
  width: 28%;
  height: auto; /* 원본 비율 유지 */
  position: absolute;
  bottom: 0; /* ✅ 항상 아래쪽 고정 */
  left: 26%;
  transform: translateX(-50%); /* 가운데 정렬 */
  object-fit: cover;
  object-position: bottom; /* ✅ 이미지 잘릴 때 아래쪽 기준 */
`;
