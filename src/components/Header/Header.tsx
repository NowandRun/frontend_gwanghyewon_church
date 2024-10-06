import React from 'react';
import Mode from './DarkMode';
import styled from 'styled-components';
import Sitemap from './Sitemap';

function Header() {
  return (
    <>
      <HeaderContainer>
        <Logo>
          <span>교회로고</span>
        </Logo>
        <SubPage>
          <span>섬기는 이들</span>
          <span>설교</span>
          <span>다음세대</span>
          <span>교육 소그룹</span>
          <span>전도 선교</span>
          <span>교회소식</span>
        </SubPage>
        <UserFeat>
          <span>회원가입</span>
          <span>로그인</span>
          <Mode />
        </UserFeat>
        <div>
          <SitemapWrapper>
            <Sitemap />
          </SitemapWrapper>
        </div>
      </HeaderContainer>
      <hr />
    </>
  );
}

export default Header;

const HeaderContainer = styled.header`
  position: relative; /* Sitemap을 absolute로 위치시키기 위한 기준 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10rem;
  padding-right: 10rem;
  width: 100%;
  max-width: 1400px; /* 2xl screen size */
  margin-left: auto;
  margin-right: auto;
  padding: 20px 0;
`;

const Logo = styled.div`
  font-size: 40px;
`;

const SubPage = styled.div`
  font-size: 20px;
  font-weight: bold;
  span:not(:first-child) {
    margin-left: 40px;
  }
`;

const UserFeat = styled.div`
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  span:not(:last-child) {
    margin-right: 15px;
    border-right: 1px solid #ccc; /* 여기에 경계선 추가 */
    padding-right: 10px; /* 경계선과 텍스트 간의 여백 */
  }
`;

const SitemapWrapper = styled.div`
  position: absolute;
  bottom: -20px; /* hr 위에 겹쳐서 보이도록 아래로 배치 */
  right: 0;
  display: flex;
  justify-content: center;
`;
