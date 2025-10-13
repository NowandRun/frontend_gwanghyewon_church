import React from 'react';
import styled from 'styled-components';

function Worship() {
  return <WorshipWrapper></WorshipWrapper>;
}

export default Worship;

const WorshipWrapper = styled.div`
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
