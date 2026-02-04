import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';
import React from 'react';
import styled from 'styled-components';

// ✅ 아이콘 등록

function Elementary() {
  return (
    <ElementaryWrapper>
      <ElementaryTitle>하꿈주일학교</ElementaryTitle>
      <ElementaryBanner>
        <ElementaryBannerTitleOne>유·초등부</ElementaryBannerTitleOne>
        <ElementaryBannerTitleTwo>광혜원순복음 주일학교</ElementaryBannerTitleTwo>
      </ElementaryBanner>
      <ElementaryVisionContentWrapper>
        <ElementaryVisionTitle>Vision</ElementaryVisionTitle>
        <ElementaryVisionWrapper>
          <RiDoubleQuotesLWrapper>
            <RiDoubleQuotesL />
          </RiDoubleQuotesLWrapper>
          <ElementaryVisionTextWrapper>
            <ElementaryVisionSubTitle>
              예수님을 사랑하고 말씀으로 자라는 어린이
            </ElementaryVisionSubTitle>
            <ElementaryVisionWord>
              예수는 지혜와 키가 자라가며 하나님과 사람에게 더욱 사랑스러워 가시더라 (누가복음 2:52)
            </ElementaryVisionWord>
          </ElementaryVisionTextWrapper>
          <RiDoubleQuotesRWrapper>
            <RiDoubleQuotesR />
          </RiDoubleQuotesRWrapper>
        </ElementaryVisionWrapper>
      </ElementaryVisionContentWrapper>

      <ElementaryEducationContentWrapper>
        <ElementaryEducationTitle>교육목표</ElementaryEducationTitle>
        <ElementaryEducationTableWrapper>
          <ElementaryEducationTableTBody>
            {/* 1번과 제목을 같은 줄에 */}
            <ElementaryEducationTableTrWrapper>
              <tr>
                <ElementaryEducationTableCell>1</ElementaryEducationTableCell>
                <ElementaryEducationSubTitle>
                  하나님을 인격적으로 만나는 신앙의 기초 형성
                </ElementaryEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <ElementaryEducationEmptyCell />
                <ElementaryEducationSubText>
                  기도, 찬양, 말씀을 통해 말씀을 사랑하도록 교육
                </ElementaryEducationSubText>
              </tr>
            </ElementaryEducationTableTrWrapper>
            <ElementaryEducationTableTrWrapper>
              <tr>
                <ElementaryEducationTableCell>2</ElementaryEducationTableCell>
                <ElementaryEducationSubTitle>
                  말씀 암송과 성경 이야기 중심의 교육
                </ElementaryEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <ElementaryEducationEmptyCell />
                <ElementaryEducationSubText>
                  성경의 주요 인물과 사건을 이야기로 배우며 성경관 형성
                </ElementaryEducationSubText>
              </tr>
            </ElementaryEducationTableTrWrapper>
            <ElementaryEducationTableTrWrapper>
              <tr>
                <ElementaryEducationTableCell>3</ElementaryEducationTableCell>
                <ElementaryEducationSubTitle>교회 생활의 즐거움 체험</ElementaryEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <ElementaryEducationEmptyCell />
                <ElementaryEducationSubText>
                  예배, 공동체 활동을 통해 교회가 즐겁고 편안한 공간임을 경험
                </ElementaryEducationSubText>
              </tr>
            </ElementaryEducationTableTrWrapper>
          </ElementaryEducationTableTBody>
        </ElementaryEducationTableWrapper>
      </ElementaryEducationContentWrapper>
    </ElementaryWrapper>
  );
}

export default Elementary;

const ElementaryWrapper = styled.div`
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

const ElementaryTitle = styled.div`
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

const ElementaryBanner = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ElementaryBannerTitleOne = styled.p`
  font-size: 2vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
  }
`;

const ElementaryBannerTitleTwo = styled.p`
  font-size: 2.5vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.7vw;
  }
`;

const ElementaryVisionContentWrapper = styled.div`
  margin: 8vw 0;
`;

const ElementaryVisionWrapper = styled.div`
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

const ElementaryVisionTextWrapper = styled.div`
  font-size: 1.2vw;
  text-align: center;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const ElementaryVisionTitle = styled.p`
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

const ElementaryVisionSubTitle = styled.p``;

const ElementaryVisionWord = styled.p`
  font-style: italic;
`;

const ElementaryEducationContentWrapper = styled.div``;

const ElementaryEducationTitle = styled.p`
  font-size: 1.8vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

const ElementaryEducationTableWrapper = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 1.1rem;
`;

const ElementaryEducationTableTBody = styled.tbody``;

const ElementaryEducationTableCell = styled.td`
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

const ElementaryEducationEmptyCell = styled.td`
  width: 5%; /* 번호 셀 자리 비움 */
`;

const ElementaryEducationSubTitle = styled.td`
  font-weight: 800; /* 번호와 비슷하게 굵게 */
  font-size: 1.2vw; /* 번호와 동일 크기 */
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const ElementaryEducationSubText = styled.td`
  font-size: 1.2vw;
  padding-top: 0.2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const ElementaryEducationTableTrWrapper = styled.div`
  margin-top: 1vw;
`;
