import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import { darkTheme } from './types/theme';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from './types/atoms';

function Root() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <div>
      <Header />
      <Outlet context={{ isDark }} />
    </div>
  );
}

export default Root;
