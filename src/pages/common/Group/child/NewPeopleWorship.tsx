import React from 'react';
import styled from 'styled-components';
import { FaPenNib, FaComments, FaChalkboardTeacher, FaMedal } from 'react-icons/fa';

function NewPeopleWorship() {
  const steps = [
    {
      icon: <FaPenNib />,
      title: '현장등록',
      description:
        '1) 모든 공예배 시작 전, 후 안내데스크에 오셔서 등록카드를 작성해 주세요.\n2) 현장 등록하신 분들에게는 담임목사께서 소정의 새가족 선물을 드립니다.',
    },
    {
      icon: <FaComments />,
      title: '담임목사와의 만남',
      description:
        '등록 후 주일 현장예배를 드리신 분들은 예배 후 새가족 영접실에서 담임목사님과 만남의 시간이 있습니다.',
    },
    {
      icon: <FaChalkboardTeacher />,
      title: '새가족교육',
      description: '담임목사님과 함께 3주간의 새가족 양육교육을 받습니다.',
    },
    {
      icon: <FaMedal />,
      title: '양육수료식',
      description: '3주간의 양육교육을 수료하신 분께는 양육수료증을 드립니다.',
    },
  ];
  return (
    <NewPeopleWorshipWrapper>
      <NewPeopleWorshipTitle>예배</NewPeopleWorshipTitle>
      <NewPeopleWorshipTableWrapper>
        {steps.map((step, index) => (
          <NewPeopleWorshipTableRow key={index}>
            <NewPeopleWorshipIconBoxWrapper>
              <NewPeopleWorshipIconBox>{step.icon}</NewPeopleWorshipIconBox>
            </NewPeopleWorshipIconBoxWrapper>
            <NewPeopleWorshipContentBox>
              <NewPeopleWorshipStepTitleWrapper>
                <NewPeopleWorshipStepTitle>{step.title}</NewPeopleWorshipStepTitle>
              </NewPeopleWorshipStepTitleWrapper>
              <NewPeopleWorshipStepDescription>{step.description}</NewPeopleWorshipStepDescription>
            </NewPeopleWorshipContentBox>
          </NewPeopleWorshipTableRow>
        ))}
      </NewPeopleWorshipTableWrapper>
    </NewPeopleWorshipWrapper>
  );
}

export default NewPeopleWorship;

const NewPeopleWorshipWrapper = styled.div`
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

const NewPeopleWorshipTitle = styled.div`
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

/* ✅ 표 스타일 */
const NewPeopleWorshipTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e5e5;
`;

const NewPeopleWorshipTableRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2vw;
  padding: 2vw 0;
  border-bottom: 1px solid #e5e5e5;

  ${({ theme }) => theme.media.tablet} {
    padding: 3vw 0;
    font-size: 3vw;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const NewPeopleWorshipIconBoxWrapper = styled.div`
  ${({ theme }) => theme.media.mobile} {
    display: flex;
    justify-content: center; /* ✅ 중앙 정렬 */
    align-items: center;
    width: 100%;
  }
`;

const NewPeopleWorshipIconBox = styled.div`
  font-size: 2.5vw;
  color: #00b8b0;
  min-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 10vw;
  }
`;

const NewPeopleWorshipContentBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-left: 1px solid transparent; /* 👈 아이콘 오른쪽 선 투명 처리 */
  padding-left: 0; /* 기본 padding 제거 */
`;

const NewPeopleWorshipStepTitleWrapper = styled.div`
  ${({ theme }) => theme.media.mobile} {
    text-align: center;
  }
`;

const NewPeopleWorshipStepTitle = styled.p`
  color: #00b8b0;
  font-size: 1.5vw;
  margin-bottom: 0.5rem;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 3.5vw;
  }
`;

const NewPeopleWorshipStepDescription = styled.p`
  color: #333;
  line-height: 1.6;
  font-size: 1vw;
  white-space: pre-line;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.6vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;
