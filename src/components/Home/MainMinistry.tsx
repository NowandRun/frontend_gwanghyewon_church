import React from 'react';
import styled from 'styled-components';
import { ministryItems } from './MainNavitationPart';
import { Link } from 'react-router-dom';

function Mainministry() {
  return (
    <MinistryContainer>
      <MinistryController>
        {ministryItems.map((item, index) => (
          <MinistryCard
            key={index}
            to={item.href}
          >
            <Title>{item.title}</Title>
            <Icon>{item.icon}</Icon>
            <Description>
              {item.description.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Description>
          </MinistryCard>
        ))}
      </MinistryController>
    </MinistryContainer>
  );
}

export default Mainministry;
const MinistryContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.cardBgColor};
  transition: background-color 1s;
  padding: 2.5vw 0;
`;

const MinistryController = styled.div`
  width: ${({ theme }) => theme.headerWidth.default};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row; /* ✅ 가로 정렬 */
  ${({ theme }) => theme.media.max1300} {
    width: ${({ theme }) => theme.headerWidth.responsive};
    display: flex;
    flex-wrap: nowrap; /* ✅ 줄바꿈 방지 */
    flex-direction: row; /* ✅ 가로 정렬 */
    align-items: center;
    justify-content: space-between; /* ✅ 가로 공간 확보 */
  }
`;

const MinistryCard = styled(Link)`
  flex: 1 1 22%;
  background: transparent;
  text-align: center;
  color: ${(props) => props.theme.textColor};
  transition: color 1s ease;

  border-right: 1px solid rgba(255, 255, 255, 0.4);

  &:last-child {
    border-right: none;
  }

  ${({ theme }) => theme.media.max1300} {
    flex: 1 1 100%;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
  }
`;

const Icon = styled.div`
  font-size: 5vw;
`;

const Title = styled.h3`
  font-size: 1.6vw;
  font-weight: bold;
  ${({ theme }) => theme.media.max1300} {
    font-size: 2.4vw;
  }
`;

const Description = styled.p`
  font-size: 1.3vw;
  font-weight: bold;
  ${({ theme }) => theme.media.max1300} {
    font-size: 1.8vw;
  }
`;
