import React from 'react';
import styled from 'styled-components';

const SubPageBanner = () => {
  return (
    <SubPageBannerWapper>
      <SubPageBannerImage src={process.env.PUBLIC_URL + '/images/SubPage/SubPage 배너5.jpg'} />
    </SubPageBannerWapper>
  );
};

export default SubPageBanner;

const SubPageBannerWapper = styled.div`
  height: 100vh;
  overflow: hidden; /* ✅ 부모 크기보다 큰 부분은 잘라냄 */
`;

const SubPageBannerImage = styled.img`
  width: auto;
  height: auto;
  object-fit: cover; /* ✅ 비율 유지하면서 부모에 맞게 채우기 */
  object-position: bottom; /* ✅ 잘라낼 때 위쪽을 기준으로 */
`;
