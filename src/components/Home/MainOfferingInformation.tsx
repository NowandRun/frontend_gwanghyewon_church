import React from 'react';
import styled from 'styled-components';

function MainOfferingInformation() {
  return (
    <MainOfferingInformationWrapper>
      <MainOfferingInformationController>
        <MainOfferingInformationTittleWrapper>
          <MainOfferingInformationText>온라인 헌금안내</MainOfferingInformationText>
        </MainOfferingInformationTittleWrapper>
        <MainOfferingInformationDescriptionWrapper>
          <MainOfferingInformationDescriptionText>
            {`교인들의 편의를 위해 온라인 헌금 창구를 마련했습니다.\n아래와 같은 양식으로 입력해주세요.`}
          </MainOfferingInformationDescriptionText>
        </MainOfferingInformationDescriptionWrapper>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainOfferingInformationTittleWrapper = styled.div`
  font-size: 2vw;
  padding: 2vw 0;
`;

const MainOfferingInformationText = styled.span``;

const MainOfferingInformationDescriptionWrapper = styled.div`
  /* 수평 중앙 정렬하기 */
  text-align: center;
  font-size: 1vw;
`;

const MainOfferingInformationDescriptionText = styled.span`
  white-space: pre-line;
`;
