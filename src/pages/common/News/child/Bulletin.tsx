import React from 'react';
import styled from 'styled-components';

function Bulletin() {
  return (
    <BulletinWrapper>
      <BulletinTitle>교회주보</BulletinTitle>
    </BulletinWrapper>
  );
}

export default Bulletin;

const BulletinWrapper = styled.div`
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

const BulletinTitle = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
