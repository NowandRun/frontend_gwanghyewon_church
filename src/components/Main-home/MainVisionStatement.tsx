import React from 'react';
import styled from 'styled-components';
const mainVisionTextOne = `“위로 하나님, 옆으로 성도, 밖으로 이웃”\n(Upward With God, Inward With Saints, Outward With Neighbors)`;
const mainVisionTextTwo = `우리는\n“위로” 하나님과의 깊은 사귐을 추구하여\n“옆으로” 성도와 연합하여 한 몸을 이루어 그리스도의 장성한 분량에까지 자라며\n“밖으로” 나아가 전도와 선교를 통해 세상을 섬기는 교회입니다.`;
function MainVisionStateMent() {
  return (
    <MainVisionStateMentWrapperBackground>
      <MainVisionStateMentBackgroundImageWapper>
        <MainVisionStateMentBackgroundImage
          src={`${process.env.PUBLIC_URL}/images/Main-Images/Main-Background-Image/메인-비전선언문 배경-사진2.jpg`}
          alt="비전선언문 배경"
        />
        <MainVisionStateMentContent>
          <MainVisionStateMentTitleWapper>
            <MainVisionStateMentFirstTitle>광혜원순복음교회</MainVisionStateMentFirstTitle>
            <MainVisionStateMentLastTitle>비전선언문</MainVisionStateMentLastTitle>
          </MainVisionStateMentTitleWapper>
          <MainVisionStateMentBoderline>
            <Line />
            <StarShape />
            <Line />
          </MainVisionStateMentBoderline>
          <MainVisionStateMentTextWapper>
            <MainVisionStateMentOneText>
              {mainVisionTextOne.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </MainVisionStateMentOneText>
            <MainVisionStateMentTwoText>
              {mainVisionTextTwo.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </MainVisionStateMentTwoText>
          </MainVisionStateMentTextWapper>
        </MainVisionStateMentContent>
      </MainVisionStateMentBackgroundImageWapper>
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
  height: 50vw;
  border-bottom: 0.1vw solid ${(props) => props.theme.mainHomePage.mainVisionStatementLine};
  transition: border 0.3s ease-in-out;
  ${({ theme }) => theme.media.tablet} {
    height: 65vw;
  }
  ${({ theme }) => theme.media.mobile} {
    height: 70vw;
  }
`;

const MainVisionStateMentBackgroundImageWapper = styled.div`
  position: relative;
  width: ${(pers) => pers.theme.headerWidth.default};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`;

const MainVisionStateMentBackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const MainVisionStateMentContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex; /* ✅ 좌/우 라인 + 중앙 별 배치 */
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const MainVisionStateMentTitleWapper = styled.div`
  position: relative; /* ✅ Borderline 위치 기준 */
  display: flex; /* ✅ 좌/우 라인 + 중앙 별 배치 */
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 3vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 4vw;
  }
`;

const MainVisionStateMentFirstTitle = styled.span`
  font-weight: 400;
  margin-top: 8vw;
  color: ${(props) => props.theme.mainHomePage.mainVisionStatementTitle};
`;

const MainVisionStateMentLastTitle = styled.span`
  margin-left: 1vw;
  font-weight: 600;
  margin-top: 8vw;
  color: ${(props) => props.theme.mainHomePage.mainVisionStatementTitle};
`;

const MainVisionStateMentBoderline = styled.div`
  position: inherit; /* ✅ 부모 기준 절대 위치 */
  bottom: 0; /* ✅ TitleWapper 아래쪽에 붙임 */
  display: flex; /* ✅ 좌/우 라인 + 중앙 별 배치 */
  align-items: center;
  justify-content: center;
  width: 100vw;
  margin: 0 auto;
`;

const Line = styled.div`
  flex: 1;
  height: 0.1vw;
  background-color: ${(props) => props.theme.mainHomePage.mainVisionStatementLine};
`;

const StarShape = styled.div`
  margin: 0 20px; /* ✅ 별 좌우 여백 */
  width: 3vw;
  height: 3vw;
  background-color: ${(props) => props.theme.mainHomePage.mainVisionStatementStar};
  clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
  ${({ theme }) => theme.media.tablet} {
    width: 4vw;
    height: 4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    width: 5vw;
    height: 5vw;
  }
`;

const MainVisionStateMentTextWapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: static;
  justify-content: center;
`;

const MainVisionStateMentOneText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #44444e;
  font-size: 1.4vw;
  font-weight: 400;
  z-index: 2;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.5vw;
  }
`;

const MainVisionStateMentTwoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2vw;
  color: #44444e;
  font-size: 1.4vw;
  font-weight: 400;
  z-index: 2;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.5vw;
  }
`;
