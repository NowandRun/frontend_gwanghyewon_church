import React from 'react';
import styled from 'styled-components';

function Tidings() {
  return (
    <TidingsWrapper>
      <TidingsTitle>교회소식</TidingsTitle>
    </TidingsWrapper>
  );
}

export default Tidings;

const TidingsWrapper = styled.div`
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

const TidingsTitle = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
