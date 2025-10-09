import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SubPageNav from '../../../components/Sub-page/SabPageNav/SubPageNav';
import SubPageBanner from '../../../components/Sub-page/SubPageBanner';
import styled from 'styled-components';

function Info() {
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const [navTop, setNavTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!rightRef.current || !leftRef.current) return;
      const rect = rightRef.current.getBoundingClientRect();
      const offsetTop = Math.max(0, -rect.top + 250); // 상단에서 20px 띄움
      const maxOffset = rect.height - leftRef.current.offsetHeight;
      setNavTop(Math.min(offsetTop, maxOffset));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 위치
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <SubPageBanner
        subPageBannerTitle={'환영합니다, 주님의 사랑 안에서'}
        imageKey="Pastor"
      />
      <InfoSubIntroLayout>
        <InfoSubLeftNavWrapper
          ref={leftRef}
          style={{ transform: window.innerWidth > 768 ? `translateY(${navTop}px)` : 'none' }}
        >
          <SubPageNav />
        </InfoSubLeftNavWrapper>

        <InfoRightContentWrapper ref={rightRef}>
          <Outlet />
        </InfoRightContentWrapper>
      </InfoSubIntroLayout>
    </>
  );
}

export default Info;

const InfoSubIntroLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 70vw;
  margin: 5vw auto 0 auto;
  gap: 2rem;
  height: auto; /* 컨텐츠에 맞게 자동 */

  ${({ theme }) => theme.media.tablet} {
    width: 95%;
    max-width: 100%;
    gap: 2vw;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    margin: 0; /* ✅ 좌우 자동 마진으로 중앙 배치 */
    gap: 0;
  }
`;

const InfoSubLeftNavWrapper = styled.div`
  flex-shrink: 0; /* 좌측 네비가 줄어들지 않도록 */
  position: sticky;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`;

const InfoRightContentWrapper = styled.div`
  flex: 1;
  position: sticky;
  top: 2vw; // 상단에서 2vw 떨어진 상태로 고정
  z-index: 1; /* 네비보다 뒤로 가지 않게 */
  display: flex;
  justify-content: center; /* ✅ 가운데 정렬 */
  align-items: center; /* ✅ 세로 방향도 가운데 (필요시) */
  width: 100%;
  ${({ theme }) => theme.media.tablet} {
    flex: unset; /* ✅ flex:1 해제 */
    margin: 0 auto; /* ✅ 좌우 자동 여백으로 센터링 */
  }
  ${({ theme }) => theme.media.mobile} {
    width: 95%;
  }
`;
