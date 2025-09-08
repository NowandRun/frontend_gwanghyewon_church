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
  padding: 4vw 0;
  ${({ theme }) => theme.media.max1300} {
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
  font-size: 2vw;
  padding-bottom: 2vw;
`;

const MainOfferingInformationDescriptionWrapper = styled.div`
  /* 수평 중앙 정렬하기 */
  text-align: center;
  font-size: 1vw;
`;

const MainOfferingInformationDescriptionText = styled.span`
  display: block;
  white-space: pre-line;
`;

const MainOfferingInformationBank = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
  border-right: 0.05px solid #ccc;
  min-width: 200px;

  /* 👉 gap과 동일한 패딩 */
  padding-right: 2rem;
  ${({ theme }) => theme.media.max1300} {
    width: 100%;
  }
`;

const MainOfferingInformationBankLogoimageWrapper = styled.div``;

const MainOfferingInformationBankLogoimage = styled.img`
  width: clamp(60px, 8vw, 120px); /* ✅ 너무 작거나 크지 않게 제한 */
  height: auto;
  margin-bottom: 0.5rem;
`;
const MainOfferingInformationBankAccountInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MainOfferingInformationBankAccountNumber = styled.span`
  font-size: 1.8vw;
  font-weight: bolder;
  ${({ theme }) => theme.media.max1300} {
    width: 2.2vw;
  }
`;
const MainOfferingInformationBankAccountName = styled.span`
  font-size: clamp(12px, 1vw, 16px);
  text-align: center;
`;

const MainOfferingInformationBankWrapper = styled.div`
  margin-top: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const MainOfferingInformationHowToWriteTheAccountName = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 0.6rem;
  min-width: 150px; /* ✅ 최소 크기 */
  background-color: red;

  ${({ theme }) => theme.media.max1300} {
    width: 100%;
  }
`;

const MainOfferingInformationHowToWriteTheAccountNameMethod = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 0.8rem;
  font-size: clamp(12px, 1vw, 16px);
  width: clamp(120px, 12vw, 200px);
  height: clamp(35px, 3vw, 50px);

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const MainOfferingInformationHowToWriteTheAccountNameExample = styled(
  MainOfferingInformationHowToWriteTheAccountNameMethod,
)``;
