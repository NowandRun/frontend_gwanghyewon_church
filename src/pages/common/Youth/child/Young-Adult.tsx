import React from 'react';
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';
import styled from 'styled-components';

function YoungAdult() {
  return (
    <YoungAdultWrapper>
      <YoungAdultTitle>하람청년부</YoungAdultTitle>
      <YoungAdultBanner>
        <YoungAdultBannerTitleOne>대학생·청년</YoungAdultBannerTitleOne>
        <YoungAdultBannerTitleTwo>광혜원순복음 청년부</YoungAdultBannerTitleTwo>
      </YoungAdultBanner>

      <YoungAdultImageSection>
        <YoungAdultImage
          src={process.env.PUBLIC_URL + '/images/SubPage/Church-School/청년부.JPG'}
          alt="예배 안내 배경"
        />
      </YoungAdultImageSection>

      <YoungAdultVisionContentWrapper>
        <YoungAdultVisionTitle>Vision</YoungAdultVisionTitle>
        <YoungAdultVisionWrapper>
          <RiDoubleQuotesLWrapper>
            <RiDoubleQuotesL />
          </RiDoubleQuotesLWrapper>
          <YoungAdultVisionTextWrapper>
            <YoungAdultVisionSubTitle>
              하나님 나라의 비전을 품고 세상 가운데 그리스도의 향기를 드러내는 청년
            </YoungAdultVisionSubTitle>
            <YoungAdultVisionWordOne>
              너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요 (마태복음 5:14)
            </YoungAdultVisionWordOne>
            <YoungAdultVisionWordTwo>
              너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라
            </YoungAdultVisionWordTwo>
            <YoungAdultVisionWordThree>(로마서 12:1)</YoungAdultVisionWordThree>
          </YoungAdultVisionTextWrapper>
          <RiDoubleQuotesRWrapper>
            <RiDoubleQuotesR />
          </RiDoubleQuotesRWrapper>
        </YoungAdultVisionWrapper>
      </YoungAdultVisionContentWrapper>

      <YoungAdultEducationContentWrapper>
        <YoungAdultEducationTitle>교육목표</YoungAdultEducationTitle>
        <YoungAdultEducationTableWrapper>
          <YoungAdultEducationTableTBody>
            {/* 1번과 제목을 같은 줄에 */}
            <YoungAdultEducationTableTrWrapper>
              <tr>
                <YoungAdultEducationTableCell>1</YoungAdultEducationTableCell>
                <YoungAdultEducationSubTitle>
                  성숙한 신앙 인격과 삶의 통합
                </YoungAdultEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <YoungAdultEducationEmptyCell />
                <YoungAdultEducationSubText>
                  삶의 전 영역(학업, 직장, 연애, 재정 등) 속에 예수님의 주되심 실현
                </YoungAdultEducationSubText>
              </tr>
            </YoungAdultEducationTableTrWrapper>
            <YoungAdultEducationTableTrWrapper>
              <tr>
                <YoungAdultEducationTableCell>2</YoungAdultEducationTableCell>
                <YoungAdultEducationSubTitle>비전과 소명 발견</YoungAdultEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <YoungAdultEducationEmptyCell />
                <YoungAdultEducationSubText>
                  하나님의 나라를 위한 개인의 부르심과 진로, 사명 탐색
                </YoungAdultEducationSubText>
              </tr>
            </YoungAdultEducationTableTrWrapper>
            <YoungAdultEducationTableTrWrapper>
              <tr>
                <YoungAdultEducationTableCell>3</YoungAdultEducationTableCell>
                <YoungAdultEducationSubTitle>제자훈련과 사역참여</YoungAdultEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <YoungAdultEducationEmptyCell />
                <YoungAdultEducationSubText>
                  소그룹 제자훈련, 교회 내외 사역을 통해 실제적 신앙 훈련
                </YoungAdultEducationSubText>
              </tr>
            </YoungAdultEducationTableTrWrapper>
            <YoungAdultEducationTableTrWrapper>
              <tr>
                <YoungAdultEducationTableCell>4</YoungAdultEducationTableCell>
                <YoungAdultEducationSubTitle>
                  사회 속 영향력 있는 그리스도인 양성
                </YoungAdultEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <YoungAdultEducationEmptyCell />
                <YoungAdultEducationSubText>
                  세상 속에서 진리와 살항으로 살아가는 청년 문화 창출
                </YoungAdultEducationSubText>
              </tr>
            </YoungAdultEducationTableTrWrapper>
          </YoungAdultEducationTableTBody>
        </YoungAdultEducationTableWrapper>
      </YoungAdultEducationContentWrapper>
    </YoungAdultWrapper>
  );
}

export default YoungAdult;

const YoungAdultWrapper = styled.div`
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

const YoungAdultTitle = styled.div`
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

const YoungAdultBanner = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const YoungAdultImageSection = styled.div`
  position: relative;
  width: 100%;
  height: 25vw;
  overflow: hidden;
  border-radius: 1vw;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  ${({ theme }) => theme.media.tablet} {
    height: 35vw;
  }
  ${({ theme }) => theme.media.mobile} {
    height: 50vw;
    border-radius: 2vw;
  }
`;

const YoungAdultImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지하며 꽉 채우기 */
  transform: scale(1.05);
`;

const YoungAdultBannerTitleOne = styled.p`
  font-size: 2vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
  }
`;

const YoungAdultBannerTitleTwo = styled.p`
  font-size: 2.5vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.7vw;
  }
`;

const YoungAdultVisionContentWrapper = styled.div`
  margin: 8vw 0;
`;

const YoungAdultVisionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  margin-top: 1vw;
`;

const RiDoubleQuotesLWrapper = styled.div`
  font-size: 2vw;
  color: rgba(128, 128, 128, 0.6); /* 회색 + 60% 불투명 */
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
  }
`;

const RiDoubleQuotesRWrapper = styled.div`
  font-size: 2vw;
  color: rgba(128, 128, 128, 0.6);
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
  }
`;

const YoungAdultVisionTextWrapper = styled.div`
  text-align: center;
  font-size: 1.2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const YoungAdultVisionTitle = styled.p`
  text-transform: uppercase;
  font-size: 1.8vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

const YoungAdultVisionSubTitle = styled.p``;

const YoungAdultVisionWordOne = styled.p`
  font-style: italic;
`;

const YoungAdultVisionWordTwo = styled.p`
  font-style: italic;
`;

const YoungAdultVisionWordThree = styled.p`
  font-style: italic;
`;

const YoungAdultEducationContentWrapper = styled.div``;

const YoungAdultEducationTitle = styled.p`
  font-size: 1.8vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

const YoungAdultEducationTableWrapper = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 1.1rem;
`;

const YoungAdultEducationTableTBody = styled.tbody``;

const YoungAdultEducationTableCell = styled.td`
  width: 5%;
  font-weight: 800;
  font-size: 1.2vw; /* 번호와 제목 크기 맞춤 */
  vertical-align: top;
  padding-right: 0.5vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const YoungAdultEducationEmptyCell = styled.td`
  width: 5%; /* 번호 셀 자리 비움 */
`;

const YoungAdultEducationSubTitle = styled.td`
  font-weight: 800; /* 번호와 비슷하게 굵게 */
  font-size: 1.2vw; /* 번호와 동일 크기 */
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const YoungAdultEducationSubText = styled.td`
  font-size: 1.2vw;
  padding-top: 0.2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const YoungAdultEducationTableTrWrapper = styled.div`
  margin-top: 1vw;
`;
