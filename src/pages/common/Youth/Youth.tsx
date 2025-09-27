import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from '../../../types/atoms';
import SubPageNav from '../../../components/Sub-page/SabPageNav/SubPageNav';
import SubPageBanner from '../../../components/Sub-page/SubPageBanner';

function Youth() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <>
      <SubPageBanner
        subPageBannerTitle={'말씀안에 성장하는 주일학교'}
        imageKey="Pastor"
      />
      <Outlet context={{ isDark }} />
      <SubPageNav /> {/* 재사용 */}
    </>
  );
}

export default Youth;
