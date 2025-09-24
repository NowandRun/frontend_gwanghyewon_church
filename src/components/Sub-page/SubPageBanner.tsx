import React from 'react';
import styled from 'styled-components';

const SubPageBanner = () => {
  return (
    <SubPageBannerWapper>
      <SubPageBannerImage
        src={process.env.PUBLIC_URL + '/images/SubPage/250923-SubPage-배너-담임목사-사진.png'}
      />
      <SubPageBannerTextWrapper>
        <BigSubTitle>“Together in His Grace”</BigSubTitle>
        <BigMainTitle>환영합니다, 주님의 사랑 안에서</BigMainTitle>
      </SubPageBannerTextWrapper>
    </SubPageBannerWapper>
  );
};

export default SubPageBanner;

const SubPageBannerWapper = styled.div`
  height: 28vw;
  overflow: hidden;
  position: relative; /* 자식 이미지 절대 위치 기준 */
  background-color: ${(props) =>
    props.theme.SubPage
      .WebSubBannerBg}; /*0d5ea6, d9c4b0, e5beb5, 5d688a, e5d0ac, ffcf9d, eef7ff, 0084ff, 234C6A, 6B3F69, FA812F, 59AC77, 3A6F43, A8FBD3, F8F7BA, FFE797, 91ADC8, F75270, 48B3AF */

  ${({ theme }) => theme.media.tablet} {
    margin-top: 100px; // 헤더 높이만큼 내려줌
    height: 35vw;
  }

  ${({ theme }) => theme.media.mobile} {
    height: 42vw;
  }

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

  ${({ theme }) => theme.media.tablet} {
    left: 18%;
    width: 42%;
  }
  ${({ theme }) => theme.media.mobile} {
    left: 18%;
    width: 45%;
  }
`;

const SubPageBannerTextWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 45%; /* 이미지가 왼쪽에 있으니 살짝 오른쪽으로 */
  transform: translateY(-40%);
  padding: 2rem 3rem;
  text-align: left; /* 교회 소개 느낌은 가운데보단 왼쪽 정렬이 안정적임 */

  ${({ theme }) => theme.media.tablet} {
    left: 60%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
`;

const BigSubTitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 2rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;

  text-transform: uppercase;

  /* ✨ 은은한 금빛 효과 */
  background: ${(props) => props.theme.SubPage.WebSubBannerSubTitle};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  font-family: 'Georgia', serif;
`;

const BigMainTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.3;
  color: #ffffff;

  /* 따뜻한 그림자 */
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.7);

  animation: fadeIn 1.5s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(25px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
