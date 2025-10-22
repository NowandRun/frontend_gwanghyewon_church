import React from 'react';
import styled from 'styled-components';

function Baptism() {
  const rows = [
    {
      number: '1',
      text: '세례는 전반기(부활절)와 후반기(추수감사절)에 있습니다.',
    },
    {
      number: '2',
      text: (
        <>
          <BaptismSectionTitle>세례종류 및 자격조건</BaptismSectionTitle>

          <BaptismCategory>
            <BaptismCategoryTitle>가) 학습</BaptismCategoryTitle>
            <BaptismItem>(1) 만 14세 이상 등록교인</BaptismItem>
            <BaptismItem>(2) 믿은지 6개월 이상</BaptismItem>
          </BaptismCategory>

          <BaptismCategory>
            <BaptismCategoryTitle>나) 입교</BaptismCategoryTitle>
            <BaptismItem>(1) 만 14세 이상 된 등록교인</BaptismItem>
            <BaptismItem>(2) 유아세례를 받은 성도</BaptismItem>
          </BaptismCategory>

          <BaptismCategory>
            <BaptismCategoryTitle>다) 유아세례</BaptismCategoryTitle>
            <BaptismItem>(1) 만 6세까지</BaptismItem>
            <BaptismItem>(2) 부모 중 1인 이상 세례교인</BaptismItem>
            <BaptismItem>(3) 세례 후 만 14세가 되면 입교 대상자가 됩니다.</BaptismItem>
          </BaptismCategory>

          <BaptismCategory>
            <BaptismCategoryTitle>라) 세례</BaptismCategoryTitle>
            <BaptismItem>(1) 만 14세 이상 등록교인</BaptismItem>
            <BaptismItem>(2) 학습세례 후 6개월 이상</BaptismItem>
            <BaptismItem>(3) 구원의 확신이 있는 자</BaptismItem>
          </BaptismCategory>
        </>
      ),
    },
    {
      number: '3',
      text: '봉사 부서를 섬기시기 위해서는 양육을 수료하셔야 합니다.',
    },
  ];
  return (
    <BaptismWrapper>
      <BaptismTitle>세례 안내</BaptismTitle>
      <BaptismTable>
        {rows.map((row, index) => (
          <BaptismRow key={index}>
            <BaptismNumberCell>{row.number}</BaptismNumberCell>
            <BaptismTextCell>{row.text}</BaptismTextCell>
          </BaptismRow>
        ))}
      </BaptismTable>
    </BaptismWrapper>
  );
}

export default Baptism;

const BaptismWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    position: static;
  }
`;

const BaptismTitle = styled.div`
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

const BaptismTable = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e5e5;
`;

const BaptismRow = styled.div`
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #e5e5e5;
  padding: 1.5vw;
  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`;

const BaptismNumberCell = styled.div`
  font-weight: 600;
  color: #00b8b0;
  font-size: 1.5vw;
  width: 2vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.5vw;
    width: auto; /* ✅ 모바일에서는 세로 배치이므로 너비 제한 제거 */
  }
`;

const BaptismTextCell = styled.div`
  flex: 1;
  line-height: 1.8;
  color: #333;
  padding-left: 1vw;
  font-size: 1vw;
  white-space: pre-line;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.6vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.4vw;
    display: block; /* ✅ 모바일에서는 일반 블록으로 복귀 */
    text-align: center;
  }
`;

/* ✅ 세부 구조 스타일 */
const BaptismSectionTitle = styled.div`
  font-size: 1.1vw;
  margin-bottom: 0.8vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    display: flex;
    justify-content: center;
    font-size: 2.4vw;
  }
`;

const BaptismCategory = styled.div`
  margin-bottom: 1vw;
  margin-left: 1vw;
  ${({ theme }) => theme.media.mobile} {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
`;

const BaptismCategoryTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.3vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.6vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.6vw;
  }
`;

const BaptismItem = styled.div`
  margin-left: 1.5vw;
  line-height: 1.8;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.4vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;
