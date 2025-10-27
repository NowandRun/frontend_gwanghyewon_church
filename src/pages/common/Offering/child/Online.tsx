import React from 'react';
import styled from 'styled-components';

function Online() {
  return (
    <OnlineWrapper>
      <OnlineTitle>온라인 헌금</OnlineTitle>

      {/* 🔹 상단 배경 이미지 영역 */}
      <OnlineTitleSection>
        <BackgroundImg
          src={
            process.env.PUBLIC_URL +
            '/images/Main-Images/Main-Background-Image/메인-예배-안내 이미지.jpg'
          }
          alt="예배 안내 배경"
        />
        <Overlay />
        <OnlineTitleText>온라인 헌금</OnlineTitleText>
      </OnlineTitleSection>

      <OnlineContent>
        <OnlineText>
          <strong>교인들의 편의를(출장중이신 분, 특별한 사정이 있으신 분)</strong> 위해 온라인 헌금
          창구를 마련했습니다.
        </OnlineText>

        <OnlineText>
          필요하신 분은 활용하시기 바랍니다. <br />
        </OnlineText>

        <AccountBox>
          <BankLogo
            src={process.env.PUBLIC_URL + '/images/bank/농협은행로고.png'}
            alt="NH농협은행"
          />
          <AccountInfo>
            <BankText>
              농협은행 <AccountNumber>351-0160400453</AccountNumber> 광혜원순복음교회
            </BankText>
          </AccountInfo>
        </AccountBox>
        <AccountSendTextWrapper>
          <AccountSendText>
            * 입금 시 <strong>반드시</strong> 헌금항목과 성함(예:십일조/홍길동)를 기재해 주시기
            바랍니다.
          </AccountSendText>
        </AccountSendTextWrapper>
      </OnlineContent>
    </OnlineWrapper>
  );
}

export default Online;

const OnlineWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    position: static;
  }
`;

const OnlineTitle = styled.div`
  font-size: 1.5vw;
  height: 3vw;
  padding: 2vw 0;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.media.tablet} {
    height: 4vw; /* 예: 60px 고정 */
    padding: 3vw 0;
    font-size: 3vw;
  }
`;

const OnlineTitleSection = styled.div`
  position: relative;
  width: 100%;
  height: 18vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid #00b3b3;

  ${({ theme }) => theme.media.tablet} {
    height: 30vw;
  }
  ${({ theme }) => theme.media.mobile} {
    height: 40vw;
  }
`;

const BackgroundImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1);
`;

/* 🔹 제목 텍스트 */
const OnlineTitleText = styled.h1`
  position: relative; /* 오버레이 위에 표시 */
  color: white;
  z-index: 1;
  font-size: 2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.7vw;
  }
`;

const OnlineContent = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: left;
  font-size: 1.1vw;
  line-height: 1.8;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.3vw;
  }
`;

const OnlineText = styled.p`
  margin: 1.5vw 0;
`;

const AccountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5vw 2vw;
  margin-top: 3vw;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    text-align: center;
  }
`;

const BankLogo = styled.img`
  width: 7vw;
  height: auto;
  margin-right: 2vw;
  ${({ theme }) => theme.media.tablet} {
    margin-right: 2vw;
    width: 9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    margin-right: 2vw;
    width: 14vw;
    margin-bottom: 2vw;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
`;

const BankText = styled.span`
  font-size: 1.2vw;
  font-weight: 600;
  color: #008080;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.5vw;
  }
`;

const AccountNumber = styled.span`
  color: #000;
  font-weight: 700;
  margin: 0 0.5vw;
`;

const AccountSendTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1vw;
`;

const AccountSendText = styled.p``;
