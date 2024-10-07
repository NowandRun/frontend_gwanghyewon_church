import React from 'react';
import Mode from './DarkMode';
import styled from 'styled-components';
import Sitemap from './Sitemap';

function Header() {
  return (
    <AllContents>
      <HeaderContainer>
        <Logo>
          <span>교회로고</span>
        </Logo>
        <SubPage>
          <li>섬기는 이들</li>
          <li>설교</li>
          <li>다음세대</li>
          <li>교육 소그룹</li>
          <li>전도 선교</li>
          <li>교회소식</li>
        </SubPage>
        <UserFeat>
          <span>회원가입</span>
          <span>로그인</span>
          <ModeWrapper>
            <Mode />
          </ModeWrapper>
        </UserFeat>
        <div>
          <SitemapWrapper>
            <Sitemap />
          </SitemapWrapper>
        </div>
      </HeaderContainer>
      <hr />
    </AllContents>
  );
}

export default Header;

const AllContents = styled.div`
  transition: 1s; /* 이 부분은 기본 상태에서의 전환 속도 */
  /* 화면 크기가 1300px 이상일 때만 hover 효과 적용 */
  @media (min-width: 1300px) {
    &:hover {
      color: black;
      background-color: white;
    }
  }
  @media (max-width: 1300px) {
    background-color: ${(props) => props.theme.cardBgColor};
  }
`;

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
  height: 100px; /* 고정된 높이 */
  @media (max-width: 1300px) {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  font-size: 40px;
  @media (max-width: 1300px) {
    transition: 1s;
    font-size: 15px;
  }
`;

const SubPage = styled.ul`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  li:not(:first-child) {
    margin-left: 40px;
  }

  /* 작은 화면에서는 숨기기 */
  @media (max-width: 1300px) {
    display: none;
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

  /* 작은 화면에서는 '회원가입'과 '로그인' 숨기기 */
  @media (max-width: 1300px) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    justify-content: flex-end;
    span:not(:last-child) {
      display: none;
    }
  }
`;

const ModeWrapper = styled.div`
  @media (max-width: 1300px) {
    margin-right: 10px; /* 여유 공간 확보 */
  }
`;

const SitemapWrapper = styled.div`
  position: absolute;
  bottom: -20px; /* hr 위에 겹쳐서 보이도록 아래로 배치 */
  right: 0;
  display: flex;
  justify-content: center;
  top: 0;
  @media (max-width: 1300px) {
    position: relative;
  }
`;
