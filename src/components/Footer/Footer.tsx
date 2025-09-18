import { VideoIcon } from '@phosphor-icons/react';
import React from 'react';
import styled from 'styled-components';

const footerYoutubeText = `유튜브\n채널`;

function Footer() {
  return (
    <StyledFooter>
      <StyledFooterWrapper>
        <FooterLogoWrapper>
          <FooterLogo
            src={process.env.PUBLIC_URL + '/images/logo/new2.png'}
            alt="header로고"
          />
        </FooterLogoWrapper>
        <FooterMiddleWapper>
          <FooterMiddleControl>
            <p>충북 진천군 광혜원면 화랑3길 17</p>
            <FooterMiddleTexttwo>
              Copyright @ 2025 <span>Gwanghyewon Full Gospel Church</span> ALL rights reserved.
            </FooterMiddleTexttwo>
            <p>Provided by WAVENEXUS</p>
          </FooterMiddleControl>
        </FooterMiddleWapper>

        <FooterLastWapper>
          <a
            href="https://www.youtube.com/@Mrssomman"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CircleIconWrapper>
              <YouTubeIconWrapper>
                <VideoIcon weight="fill" />
              </YouTubeIconWrapper>
              <FooterLastYouTubeText>
                {footerYoutubeText.split('\n').map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </FooterLastYouTubeText>
            </CircleIconWrapper>
          </a>
        </FooterLastWapper>
      </StyledFooterWrapper>
    </StyledFooter>
  );
}

export default Footer;

const StyledFooter = styled.footer`
  border-top: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 12vw;
  width: 100%;
  background-color: ${(props) => props.theme.cardBgColor};
  ${({ theme }) => theme.media.tablet} {
    height: 14vw;
  }
  ${({ theme }) => theme.media.mobile} {
    height: 20vw;
  }
`;

const StyledFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.theme.headerWidth.default};
  height: 100%;
  ${({ theme }) => theme.media.tablet} {
    width: ${(props) => props.theme.headerWidth.responsive};
    padding: 0 4vw;
  }
`;

const FooterLogoWrapper = styled.div`
  flex: 1;
`;

const FooterLogo = styled.img`
  width: 15vw;
  height: 100%;
  ${({ theme }) => theme.media.tablet} {
    padding-right: 20px;
    width: 18vw;
  }
  ${({ theme }) => theme.media.tablet} {
    width: 21vw;
  }
`;

const FooterMiddleWapper = styled.div`
  flex: 3;
  color: ${(props) => props.theme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterMiddleControl = styled.div`
  font-size: 1vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 1.4vw;
  }
`;

const FooterMiddleTexttwo = styled.p`
  color: ${(props) => props.theme.textColor};
  span {
    text-transform: uppercase;
    color: #f2c078;
  }
`;

const FooterLastWapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const CircleIconWrapper = styled.div`
  font-size: 1.6vw;
  width: 5vw;
  height: 5vw;
  border: 3px solid ${(props) => props.theme.textColor};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  svg {
    color: ${(props) => props.theme.textColor};
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
    width: 7vw;
    height: 7vw;
    border: 2px solid ${(props) => props.theme.textColor};
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.8vw;
    width: 8vw;
    height: 8vw;
    border: 1px solid ${(props) => props.theme.textColor};
  }
`;

const YouTubeIconWrapper = styled.div`
  display: flex;
`;

const FooterLastYouTubeText = styled.span`
  font-size: 0.8vw;
  text-align: center;
  color: ${(props) => props.theme.textColor};
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 1.4vw;
  }
`;
