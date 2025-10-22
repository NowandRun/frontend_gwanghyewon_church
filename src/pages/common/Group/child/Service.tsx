import React from 'react';
import styled from 'styled-components';
import { FaMusic, FaVideo, FaHandsHelping, FaBookOpen, FaBus, FaUtensils } from 'react-icons/fa';

function Service() {
  const steps = [
    {
      icon: <FaMusic />,
      title: '찬양단',
      description: '예배 전 준비찬양으로 함께하는 봉사입니다.',
    },
    {
      icon: <FaVideo />,
      title: '미디어&방송사역',
      description: '모든 공예배 영상촬영 및 사진촬영입니다.',
    },
    {
      icon: <FaHandsHelping />,
      title: '안내',
      description: '주일과 수요, 금요성령집회 등의 공예배를 안내하고 섬깁니다.',
    },
    {
      icon: <FaBookOpen />,
      title: '교회학교 교사',
      description: '믿음의 교회 세대를 이어가는 사역입니다.',
    },
    {
      icon: <FaBus />,
      title: '차량운행',
      description: '교회 차량 봉사 및 주차 안내 사역입니다.',
    },
    {
      icon: <FaUtensils />,
      title: '식당',
      description: '성도들에게 사랑과 정성으로 육의 양식을 공급하는 사역입니다.',
    },
  ];
  return (
    <ServiceWrapper>
      <ServiceTitle>봉사</ServiceTitle>
      <ServiceTableWrapper>
        {steps.map((step, index) => (
          <ServiceTableRow key={index}>
            <ServiceIconBoxWrapper>
              <ServiceIconBox>{step.icon}</ServiceIconBox>
            </ServiceIconBoxWrapper>
            <ServiceContentBox>
              <ServiceStepTitleWrapper>
                <ServiceStepTitle>{step.title}</ServiceStepTitle>
              </ServiceStepTitleWrapper>
              <ServiceStepDescription>{step.description}</ServiceStepDescription>
            </ServiceContentBox>
          </ServiceTableRow>
        ))}
      </ServiceTableWrapper>
    </ServiceWrapper>
  );
}

export default Service;

const ServiceWrapper = styled.div`
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

const ServiceTitle = styled.div`
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
const ServiceTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e5e5;

  ${({ theme }) => theme.media.mobile} {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* ✅ 2열 구성 */
    gap: 3vw; /* 셀 간격 */
    border-top: none;
  }
`;

const ServiceTableRow = styled.div`
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
    align-items: center;
    gap: 1rem;
  }
`;

const ServiceIconBoxWrapper = styled.div`
  ${({ theme }) => theme.media.mobile} {
    display: flex;
    justify-content: center; /* ✅ 중앙 정렬 */
    align-items: center;
    width: 100%;
  }
`;

const ServiceIconBox = styled.div`
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
    font-size: 8vw;
  }
`;

const ServiceContentBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  border-left: 1px solid transparent; /* 👈 아이콘 오른쪽 선 투명 처리 */
  padding-left: 0; /* 기본 padding 제거 */
  ${({ theme }) => theme.media.mobile} {
    justify-content: center;
  }
`;

const ServiceStepTitleWrapper = styled.div`
  ${({ theme }) => theme.media.mobile} {
    text-align: center;
  }
`;

const ServiceStepTitle = styled.p`
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

const ServiceStepDescription = styled.p`
  color: #333;
  line-height: 1.6;
  font-size: 1vw;
  white-space: pre-line;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.6vw;
  }

  ${({ theme }) => theme.media.mobile} {
    font-size: 2.6vw;
  }
`;
