import React from 'react';
import styled from 'styled-components';

function MainVisionStateMent() {
  return (
    <MainVisionStateMentWrapperBackground>
      <MainVisionStateMentBackgroundImageWapper>
        <MainVisionStateMentBackgroundImage
          src={`${process.env.PUBLIC_URL}/images/Main-Images/Main-Background-Image/메인-비전선언문 배경-사진2.jpg`}
          alt="비전선언문 배경"
        />
      </MainVisionStateMentBackgroundImageWapper>
      <MainVisionStateMentWrapper>
        {/* ✅ 배경 이미지 */}

        {/* ✅ 제목 */}
        <MainVisionStateMentTitle>광혜원순복음교회 비전선언문</MainVisionStateMentTitle>
      </MainVisionStateMentWrapper>
      <MainVisionStateMentBoderline />
    </MainVisionStateMentWrapperBackground>
  );
}

export default MainVisionStateMent;

/* ========================= Styled Components ========================= */

const MainVisionStateMentWrapperBackground = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: sticky; /* ::after 기준 */
`;
const MainVisionStateMentBackgroundImageWapper = styled.div`
  width: ${(pers) => pers.theme.headerWidth.default};
  position: initial;
  display: flex;
  justify-content: center;
  align-items: center;
`;
/* border line을 부모 안에서 너비 100%로 잡기 위해 Wrapper에 relative 추가 */
const MainVisionStateMentWrapper = styled.section`
  position: relative;

  height: 50vw;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
`;

const MainVisionStateMentBackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  z-index: 0; /* 배경 */
`;

const MainVisionStateMentTitle = styled.h2`
  position: relative;
  z-index: 1; /* 배경 위 */
  font-size: 2.5rem;
  font-weight: 700;
  color: #00a0d1;
  margin-bottom: 1rem;
  /* ✅ 부모 width와 동일하게 border line */
`;

const MainVisionStateMentBoderline = styled.div`
  content: '';
  position: absolute;
  bottom: -0.5rem; /* 제목 바로 아래 */
  left: 0;
  width: 100%; /* 부모 width와 동일 */
  height: 3px; /* 선 두께 */
  background-color: #00a0d1;
`;
