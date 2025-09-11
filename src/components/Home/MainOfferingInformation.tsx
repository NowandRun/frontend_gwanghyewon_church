import React from 'react';
import styled from 'styled-components';

function MainOfferingInformation() {
  return (
    <MainOfferingInformationWrapper>
      <MainOfferingInformationController>
        <MainOfferingInformationTittleController>
          <MainOfferingInformationTittleWrapper>
            온라인 헌금안내
          </MainOfferingInformationTittleWrapper>
          <MainOfferingInformationDescriptionWrapper>
            <MainOfferingInformationDescriptionText>
              {`교인들의 편의를 위해 온라인 헌금 창구를 마련했습니다.\n아래와 같은 양식으로 입력해주세요.`}
            </MainOfferingInformationDescriptionText>
          </MainOfferingInformationDescriptionWrapper>
        </MainOfferingInformationTittleController>
        <MainOfferingInformationBankWrapper>
          <MainOfferingInformationBank>
            <MainOfferingInformationBankAccountInformation>
              <MainOfferingInformationBankLogoimageWrapper>
                <MainOfferingInformationBankLogoimage
                  src={process.env.PUBLIC_URL + '/images/bank/농협은행로고.png'}
                  alt="header로고"
                />
              </MainOfferingInformationBankLogoimageWrapper>
              <MainOfferingInformationBankAccountNumber>
                351-0160400453
              </MainOfferingInformationBankAccountNumber>
              <MainOfferingInformationBankAccountName>
                {`농협은행(예금주 : 광혜원순복음교회)`}
              </MainOfferingInformationBankAccountName>
            </MainOfferingInformationBankAccountInformation>
          </MainOfferingInformationBank>
          <MainOfferingInformationHowToWriteTheAccountName>
            <MainOfferingInformationHowToWriteTheAccountNameMethod>
              헌금항목/이름
            </MainOfferingInformationHowToWriteTheAccountNameMethod>
            <MainOfferingInformationHowToWriteTheAccountNameExample>
              {`예) 십일조/홍길동`}
            </MainOfferingInformationHowToWriteTheAccountNameExample>
          </MainOfferingInformationHowToWriteTheAccountName>
        </MainOfferingInformationBankWrapper>
      </MainOfferingInformationController>
    </MainOfferingInformationWrapper>
  );
}

export default MainOfferingInformation;

const MainOfferingInformationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainOfferingInformationController = styled.div`
  width: ${(pers) => pers.theme.headerWidth.default};
  padding: 10vw 0;

  ${({ theme }) => theme.media.tablet} {
    width: ${(pers) => pers.theme.headerWidth.responsive};
  }
`;

const MainOfferingInformationTittleController = styled.div`
  display: block;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const MainOfferingInformationTittleWrapper = styled.div`
  font-size: 3vw;
  padding-bottom: 1vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 4vw;
    padding-bottom: 1vw;
  }
`;

const MainOfferingInformationDescriptionWrapper = styled.div`
  /* 수평 중앙 정렬하기 */
  text-align: center;
  font-size: 1.3vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.2vw;
    padding-bottom: 1vw;
  }
`;

const MainOfferingInformationDescriptionText = styled.span`
  display: block;
  white-space: pre-line;
`;

const MainOfferingInformationBank = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end; /* 세로 정렬 통일 */
  border-right: 0.05px solid #ccc;
  padding-right: 2vw;
  ${({ theme }) => theme.media.tablet} {
    align-items: center;
    padding-right: 0;
  }
`;

const MainOfferingInformationBankLogoimageWrapper = styled.div``;

const MainOfferingInformationBankLogoimage = styled.img`
  width: 7vw;
  /* width: clamp(60px, 8vw, 120px);  */ /* ✅ 너무 작거나 크지 않게 제한 */
  height: auto;
  ${({ theme }) => theme.media.tablet} {
    width: 15vw;
  }
`;
const MainOfferingInformationBankAccountInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MainOfferingInformationBankAccountNumber = styled.span`
  font-size: 1.6vw;
  font-weight: bolder;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.3vw;
  }
`;
const MainOfferingInformationBankAccountName = styled.span`
  font-size: 1.3vw;
  text-align: center;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.2vw;
  }
`;

const MainOfferingInformationBankWrapper = styled.div`
  margin-top: 2vw;
  display: flex;
  justify-content: flex-start; /* 👉 왼쪽 정렬 */
  align-items: stretch; /* 자식이 부모 높이 다 쓰게 */
  height: 100%; /* fit-content 대신 부모 높이 강제 */
  flex: 1;
`;

const MainOfferingInformationHowToWriteTheAccountName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  gap: 0.6rem;
  position: relative;
  padding-left: 2vw;

  align-self: stretch; /* flex 아이템이 부모 높이에 맞게 늘어남 */
  ${({ theme }) => theme.media.tablet} {
    display: flex;
    justify-content: center; /* 👉 왼쪽 정렬 */
    align-items: center; /* 자식이 부모 높이 다 쓰게 */
    gap: 0.25rem;
    padding: 3.5px 0;
  }
`;

const MainOfferingInformationHowToWriteTheAccountNameMethod = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 0.8rem;
  /* font-size: clamp(12px, 1vw, 16px);
  width: clamp(120px, 12vw, 200px);
  height: clamp(35px, 3vw, 50px); */
  height: 100%;
  font-size: 1vw;
  width: 12vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  ${({ theme }) => theme.media.tablet} {
    font-size: 2.5vw;
    border-radius: 1.2vw;
    width: 24vw;
  }
`;

const MainOfferingInformationHowToWriteTheAccountNameExample = styled(
  MainOfferingInformationHowToWriteTheAccountNameMethod,
)``;
