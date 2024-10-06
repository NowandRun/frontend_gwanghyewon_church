import { useRecoilState, useSetRecoilState } from 'recoil';
import { isdarkAtom } from '../../types/atoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';

function Mode() {
  const [darkAtom, setDarkAtom] = useRecoilState(isdarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  return (
    <>
      {!darkAtom ? (
        <Icon onClick={toggleDarkAtom}>
          <FontAwesomeIcon icon={faMoon} />
        </Icon>
      ) : (
        <Icon onClick={toggleDarkAtom}>
          <FontAwesomeIcon icon={faSun} />
        </Icon>
      )}
    </>
  );
}

export default Mode;

const Icon = styled.div`
  cursor: pointer;
  border-radius: 18px;
  height: 40px;
  width: 40px;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-duration: 1s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3 /* 50% 투명도 */);
  }
`;
