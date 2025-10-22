import React from 'react';
import styled from 'styled-components';

function Upbringing() {
  const rows = [
    {
      number: '1',
      text: '새가족 담당자가 교회에 적응할 수 있도록 도움을 드리며 3주간의 새가족 양육교육을 담임목사님으로 부터 받습니다.\n(초신자나 기신자 모두 포함)',
    },
    {
      number: '2',
      text: '양육교육을 수료하시면 세례 시 학습이 면제됩니다.',
    },
    {
      number: '3',
      text: '봉사 부서를 섬기시기 위해서는 양육을 수료하셔야 합니다.',
    },
  ];
  return (
    <UpbringingWrapper>
      <UpbringingTitle>양육</UpbringingTitle>
      <UpbringingTable>
        {rows.map((row, index) => (
          <UpbringingRow key={index}>
            <UpbringingNumberCell>{row.number}</UpbringingNumberCell>
            <UpbringingTextCell>{row.text}</UpbringingTextCell>
          </UpbringingRow>
        ))}
      </UpbringingTable>
    </UpbringingWrapper>
  );
}

export default Upbringing;

const UpbringingWrapper = styled.div`
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

const UpbringingTitle = styled.div`
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

/* ✅ 표 전체 */
const UpbringingTable = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e5e5;
  overflow: hidden;

  ${({ theme }) => theme.media.mobile} {
    margin-top: 4vw;
  }
`;

/* ✅ 각 행 */
const UpbringingRow = styled.div`
  display: flex;
  align-items: stretch; /* ✅ 자식들의 높이를 동일하게 맞춤 */
  border-bottom: 1px solid #e5e5e5;
  padding: 1vw;

  ${({ theme }) => theme.media.tablet} {
    padding: 1.5vw;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    gap: 1vw;
    padding: 1vw;
  }
`;

/* ✅ 왼쪽: 번호 칸 */
const UpbringingNumberCell = styled.div`
  font-weight: 600;
  color: #00b8b0;
  font-size: 1.5vw;
  width: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 3.5vw;
    width: auto; /* ✅ 모바일에서는 세로 배치이므로 너비 제한 제거 */
  }
`;

/* ✅ 오른쪽: 내용 칸 */
const UpbringingTextCell = styled.div`
  flex: 1;
  line-height: 1.8;
  color: #333;
  white-space: pre-line;
  padding-left: 1vw;
  font-size: 1vw;
  display: flex; /* ✅ 높이 균일화를 위해 flex로 */
  align-items: center; /* ✅ 텍스트를 수직 중앙 정렬 */

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.6vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 2.4vw;
    display: block; /* ✅ 모바일에서는 일반 블록으로 복귀 */
    text-align: center;
  }
`;
