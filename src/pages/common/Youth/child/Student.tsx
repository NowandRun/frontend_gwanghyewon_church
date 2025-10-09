import React from 'react';
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri';
import styled from 'styled-components';

function Students() {
  return (
    <StudentsWrapper>
      <StudentsTitle>예람청소년부</StudentsTitle>
      <StudentsBanner>
        <StudentsBannerTitleOne>중·고등부</StudentsBannerTitleOne>
        <StudentsBannerTitleTwo>광혜원순복음 학생부</StudentsBannerTitleTwo>
      </StudentsBanner>
      <StudentsVisionContentWrapper>
        <StudentsVisionTitle>Vision</StudentsVisionTitle>
        <StudentsVisionWrapper>
          <RiDoubleQuotesLWrapper>
            <RiDoubleQuotesL />
          </RiDoubleQuotesLWrapper>
          <StudentsVisionTextWrapper>
            <StudentsVisionSubTitle>
              말씀과 기도로 세상을 이기는 예수님의 제자
            </StudentsVisionSubTitle>
            <StudentsVisionWordOne>
              너는 청년의 때에 너의 창조주를 기억하라 (전도서 12:1)
            </StudentsVisionWordOne>
            <StudentsVisionWordTwo>
              내가 청년 시절에 주께 범죄하지 아니하려 하여 주의 말씀을 내 마음에 두었나이다
              (시편119:11)
            </StudentsVisionWordTwo>
          </StudentsVisionTextWrapper>
          <RiDoubleQuotesRWrapper>
            <RiDoubleQuotesR />
          </RiDoubleQuotesRWrapper>
        </StudentsVisionWrapper>
      </StudentsVisionContentWrapper>

      <StudentsEducationContentWrapper>
        <StudentsEducationTitle>교육목표</StudentsEducationTitle>
        <StudentsEducationTableWrapper>
          <StudentsEducationTableTBody>
            {/* 1번과 제목을 같은 줄에 */}
            <StudentsEducationTableTrWrapper>
              <tr>
                <StudentsEducationTableCell>1</StudentsEducationTableCell>
                <StudentsEducationSubTitle>성경적 세계관 형성</StudentsEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <StudentsEducationEmptyCell />
                <StudentsEducationSubText>
                  다양한 세상 가치와 도전에 맞서 성경적 기준을 세움
                </StudentsEducationSubText>
              </tr>
            </StudentsEducationTableTrWrapper>
            <StudentsEducationTableTrWrapper>
              <tr>
                <StudentsEducationTableCell>2</StudentsEducationTableCell>
                <StudentsEducationSubTitle>
                  기도와 말씀을 통한 인격적 신앙 성장
                </StudentsEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <StudentsEducationEmptyCell />
                <StudentsEducationSubText>
                  큐티, 묵상, 기도훈련을 통해 스스로 하나님과 교제하는 삶 실천
                </StudentsEducationSubText>
              </tr>
            </StudentsEducationTableTrWrapper>
            <StudentsEducationTableTrWrapper>
              <tr>
                <StudentsEducationTableCell>3</StudentsEducationTableCell>
                <StudentsEducationSubTitle>리더십과 공동체 의식 함양</StudentsEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <StudentsEducationEmptyCell />
                <StudentsEducationSubText>
                  셀 모임, 봉사, 찬양사역 등을 통해 교회 공동체 안에서 역할 감당
                </StudentsEducationSubText>
              </tr>
            </StudentsEducationTableTrWrapper>
            <StudentsEducationTableTrWrapper>
              <tr>
                <StudentsEducationTableCell>4</StudentsEducationTableCell>
                <StudentsEducationSubTitle>복음 전파의 사명 자각</StudentsEducationSubTitle>
              </tr>
              {/* 부제목은 다음 줄에 */}
              <tr>
                <StudentsEducationEmptyCell />
                <StudentsEducationSubText>
                  친구 전도, 미션활동 등을 통해 복음의 삶을 실천
                </StudentsEducationSubText>
              </tr>
            </StudentsEducationTableTrWrapper>
          </StudentsEducationTableTBody>
        </StudentsEducationTableWrapper>
      </StudentsEducationContentWrapper>
    </StudentsWrapper>
  );
}

export default Students;

const StudentsWrapper = styled.div`
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

const StudentsTitle = styled.div`
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

const StudentsBanner = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StudentsBannerTitleOne = styled.p`
  font-size: 2vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
  }
`;

const StudentsBannerTitleTwo = styled.p`
  font-size: 2.5vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.7vw;
  }
`;

const StudentsVisionContentWrapper = styled.div`
  margin: 8vw 0;
`;

const StudentsVisionWrapper = styled.div`
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

const StudentsVisionTextWrapper = styled.div`
  text-align: center;
  font-size: 1.2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const StudentsVisionTitle = styled.p`
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

const StudentsVisionSubTitle = styled.p``;

const StudentsVisionWordOne = styled.p`
  font-style: italic;
`;

const StudentsVisionWordTwo = styled.p`
  font-style: italic;
`;

const StudentsEducationContentWrapper = styled.div``;

const StudentsEducationTitle = styled.p`
  font-size: 1.8vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

const StudentsEducationTableWrapper = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 1.1rem;
`;

const StudentsEducationTableTBody = styled.tbody``;

const StudentsEducationTableCell = styled.td`
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

const StudentsEducationEmptyCell = styled.td`
  width: 5%; /* 번호 셀 자리 비움 */
`;

const StudentsEducationSubTitle = styled.td`
  font-weight: 800; /* 번호와 비슷하게 굵게 */
  font-size: 1.2vw; /* 번호와 동일 크기 */
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const StudentsEducationSubText = styled.td`
  font-size: 1.2vw;
  padding-top: 0.2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const StudentsEducationTableTrWrapper = styled.div`
  margin-top: 1vw;
`;
