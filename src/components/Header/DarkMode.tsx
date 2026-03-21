import { useRecoilState } from 'recoil';
import { isdarkAtom } from '../../types/atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';

interface ModeProps {
  isMobile?: boolean; // isMobile 프롭 추가
}

function Mode({ isMobile }: ModeProps) {
  const [darkAtom, setDarkAtom] = useRecoilState(isdarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  return (
    <>
      {!darkAtom ? (
        <Icon
          onClick={toggleDarkAtom}
          isMobile={isMobile}
        >
          <FontAwesomeIcon icon={faSun} />
        </Icon>
      ) : (
        <Icon
          onClick={toggleDarkAtom}
          isMobile={isMobile}
        >
          <FontAwesomeIcon icon={faMoon} />
        </Icon>
      )}
    </>
  );
}

export default Mode;

const Icon = styled.div<{ isMobile?: boolean }>`
  cursor: pointer;
  border-radius: 50%;
  height: 2vw;
  width: 2vw;
  font-size: 1.2vw;
  display: flex;
  align-items: center;
  justify-content: center;

  /* ✅ isMobile일 때 색상을 흰색으로 고정 */
  color: ${({ isMobile }) => (isMobile ? '#FFFFFF' : 'inherit')};

  @media (min-width: 1300px) {
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }

  ${({ theme }) => theme.media.tablet} {
    height: 30px;
    width: 30px;
    font-size: 18px;
    /* 태블릿/모바일에서는 호버 효과 제거 (터치 기기 고려) */
    &:hover {
      background-color: transparent;
    }
  }
`;
