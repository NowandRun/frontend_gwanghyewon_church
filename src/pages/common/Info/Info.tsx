import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from '../../../types/atoms';
import SubPageNav from '../../../components/Sub-page/SabPageNav/SubPageNav';
import SubPageBanner from '../../../components/Sub-page/SubPageBanner';

function Info() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <>
      <SubPageBanner
        subPageBannerTitle={'환영합니다, 주님의 사랑 안에서'}
        imageKey="Pastor"
      />
      <SubPageNav /> {/* 재사용 */}
      <Outlet />
    </>
  );
}

export default Info;
