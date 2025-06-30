import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from '../../../types/atoms';

function Info() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <>
      <Outlet context={{ isDark }}/>
    </>
  );
}

export default Info;
