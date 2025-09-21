import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from '../../../types/atoms';
import SubPageNav from '../../../components/Sub-page/SabPageNav/SubPageNav';

function Info() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <>
      <Outlet />
      <SubPageNav /> {/* 재사용 */}
    </>
  );
}

export default Info;
