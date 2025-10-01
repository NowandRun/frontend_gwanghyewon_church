import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isdarkAtom } from '../../../types/atoms';
import SubPageNav from '../../../components/Sub-page/SabPageNav/SubPageNav';
import SubPageBanner from '../../../components/Sub-page/SubPageBanner';
import styled from 'styled-components';
import Greeting from './child/Greeting';

function Info() {
  const isDark = useRecoilValue(isdarkAtom);
  return (
    <>
      <SubPageBanner
        subPageBannerTitle={'환영합니다, 주님의 사랑 안에서'}
        imageKey="Pastor"
      />
      <SubIntroLayout>
        <SubLeftNavWrapper>
          <SubPageNav />
        </SubLeftNavWrapper>

        <RightContentWrapper>
          <Outlet />
        </RightContentWrapper>
      </SubIntroLayout>
    </>
  );
}

export default Info;

const SubIntroLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center; /* ✅ 전체를 가운데 정렬 */
  width: 70vw;
  margin: 5vw auto 0 auto; /* ✅ 좌우 자동 마진으로 중앙 배치 */
  gap: 2rem;
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
    gap: 2vw;
    width: 95vw;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    margin: 1vw auto 0 auto; /* ✅ 좌우 자동 마진으로 중앙 배치 */
    gap: 0;
  }
`;

const SubLeftNavWrapper = styled.div`
  z-index: 2; /* 항상 위에 */
`;

const RightContentWrapper = styled.div`
  flex: 1;
  position: relative;
  z-index: 1; /* 네비보다 뒤로 가지 않게 */
  display: flex;
  justify-content: center; /* ✅ 가운데 정렬 */
  align-items: center; /* ✅ 세로 방향도 가운데 (필요시) */
  ${({ theme }) => theme.media.tablet} {
    flex: unset; /* ✅ flex:1 해제 */
    width: auto; /* ✅ 내용 크기에 맞게 */
    max-width: 95vw; /* ✅ 너무 넓어지지 않게 */
    margin: 0 auto; /* ✅ 좌우 자동 여백으로 센터링 */
  }
`;
