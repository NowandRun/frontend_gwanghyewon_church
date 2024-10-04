import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isdarkAtom } from '../../types/atoms';
import Mode from './DarkMode';

function Header() {
  return (
    <>
      <Mode />
    </>
  );
}

export default Header;
