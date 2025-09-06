import React from 'react';
import styled from 'styled-components';
import { HomeSecondNavItems } from './MainNavitationPart';
import { Link } from 'react-router-dom';

function MainScondNavigation() {
  return (
    <HomeSecondNav>
      <HomeSecondNavOne></HomeSecondNavOne>
      <HomeSecondNavTwo>
        <HomeSecondNavTwoController>
          {HomeSecondNavItems.map((items, index) => (
            <HomeSecondNavTwoCard
              key={index}
              to={items.href}
            >
              <HomeSecondNavTwoIcon>{items.icon}</HomeSecondNavTwoIcon>
              <HomeSecondNavTwoTitle>{items.title}</HomeSecondNavTwoTitle>
            </HomeSecondNavTwoCard>
          ))}
        </HomeSecondNavTwoController>
        <HomeSecondNavEmtyController />
      </HomeSecondNavTwo>
    </HomeSecondNav>
  );
}

export default MainScondNavigation;

const HomeSecondNav = styled.div`
  height: 30vw;
  display: flex;
`;
const HomeSecondNavOne = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  ${({ theme }) => theme.media.max1300} {
    height: 100%;
    width: 50%;
  }
`;

const HomeSecondNavTwo = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d8d2c2;
  position: relative; // ✅ 추가
  ${({ theme }) => theme.media.max1300} {
    height: 100%;
    width: 70%;
  }
`;

const HomeSecondNavTwoController = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  height: 25vw;
  position: absolute;
  left: 0;
  gap: 0.1rem; /* ✅ 카드 간격 추가 */
  padding-left: 2vw;

  ${({ theme }) => theme.media.max1300} {
    padding: 0;
    width: 85%;
    height: 70%;
    position: static;
  }
`;

const HomeSecondNavEmtyController = styled.div`
  width: 30%;
  height: 100%;
  right: 0;
  position: absolute; // ✅ 추가
  ${({ theme }) => theme.media.max1300} {
    height: 0;
    width: 0;
  }
`;

const HomeSecondNavTwoCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%; // 모바일에서 2개씩 정렬
  text-align: center;
  position: static;
`;

const HomeSecondNavTwoIcon = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 1vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6vw;
  width: 6vw;
  font-size: 4vw;
  color: ${(props) => props.theme.textColor};
  transition: color 1s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  ${({ theme }) => theme.media.max1300} {
    height: 7vw;
    width: 7vw;
  }
`;

const HomeSecondNavTwoTitle = styled.h3`
  font-size: 1.4vw;
  padding-top: 0.5vw;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
  transition: color 1s;
`;
