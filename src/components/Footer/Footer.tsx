import React from 'react';
import styled from 'styled-components';

function Footer() {
  return (
    <StyledFooter>
      <FooterLogo
        src={process.env.PUBLIC_URL + '/images/logo/new2.png'}
        alt="header로고"
      />
      <FooterMiddleText>
        <p>충북 진천군 광혜원면 화랑3길 17</p>
        <FooterMiddleTexttwo>
          Copyright @ 2025 <span>Gwanghyewon Full Gospel Church</span> ALL rights reserved.
        </FooterMiddleTexttwo>
        <p>Provided by WAVENEXUS</p>
      </FooterMiddleText>
    </StyledFooter>
  );
}

export default Footer;

const StyledFooter = styled.footer`
  border-top: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  ${({ theme }) => theme.media.tablet} {
    height: 100px;
  }
`;

const FooterLogo = styled.img`
  padding-right: 50px;
  width: 15%;
  ${({ theme }) => theme.media.tablet} {
    padding-right: 20px;
    width: 30%;
  }
`;

const FooterMiddleText = styled.p`
  color: ${(props) => props.theme.textColor};
  font-size: 1.2rem;
  ${({ theme }) => theme.media.tablet} {
    font-size: 0.6rem;
  }
`;

const FooterMiddleTexttwo = styled.p`
  color: ${(props) => props.theme.textColor};
  span {
    text-transform: uppercase;
    color: #78b9b5;
  }
`;
