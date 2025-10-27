import React from 'react';
import styled from 'styled-components';

function Album() {
  return (
    <AlbumWrapper>
      <AlbumTitle>교회동정</AlbumTitle>
    </AlbumWrapper>
  );
}

export default Album;

const AlbumWrapper = styled.div`
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

const AlbumTitle = styled.div`
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
