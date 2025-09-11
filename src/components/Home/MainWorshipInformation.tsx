import React from 'react';
import styled from 'styled-components';

function MainWorshipInformation() {
  return (
    <HomeWorshipInformation>
      <SectionWrapper>
        <WorshipInformationTitle>
          <WorshipInformationText>예배안내</WorshipInformationText>
        </WorshipInformationTitle>
        <Section>
          <WorshipInformationtitle>주일예배</WorshipInformationtitle>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>1부 예배 오전 9시</Item>
            <Item>2부 예배 오전 11시</Item>
            <Item>바이블아카데미 오후 1시 30분</Item>
          </Worshiplist>
        </Section>

        <Section>
          <WorshipInformationtitle>수요 및 금요성령집회</WorshipInformationtitle>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>수요예배 저녁 7시 30분</Item>
            <Item>금요성령집회 저녁 8시 30분</Item>
          </Worshiplist>
        </Section>

        <Section>
          <WorshipInformationtitle>새벽기도회</WorshipInformationtitle>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>3층 대예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>월~금 매주 새벽 5시</Item>
          </Worshiplist>
        </Section>

        <Section>
          <WorshipInformationtitle>교회학교</WorshipInformationtitle>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>2층 하꿈예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>하꿈주일학교 오전 10시 40분</Item>
          </Worshiplist>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>2층 예람예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>예람학생부 오후 1시 20분</Item>
          </Worshiplist>
          <WorshipInformationPlace>
            <WorshipInformationPlaceName>2층 하람예배실</WorshipInformationPlaceName>
          </WorshipInformationPlace>
          <Worshiplist>
            <Item>하람청년부 오후 1시 20분</Item>
          </Worshiplist>
        </Section>
      </SectionWrapper>
    </HomeWorshipInformation>
  );
}

export default MainWorshipInformation;

const HomeWorshipInformation = styled.section`
  background: ${(props) => props.theme.bgColor};
  display: block;
`;

const WorshipInformationTitle = styled.div`
  width: 100%; /* ✅ flex에서 전체 차지 */
  text-align: center;
  margin-bottom: 3vw;
`;

const WorshipInformationText = styled.span`
  font-size: 3vw;
  font-weight: bold;
  color: #708993;
  padding-bottom: 0.5vw;

  ${({ theme }) => theme.media.tablet} {
    font-size: 4vw;
  }
`;

const SectionWrapper = styled.div`
  flex-wrap: wrap; /* ✅ 줄바꿈 허용 */
  width: 70%;
  margin: 0 auto;
  display: flex; /* ✅ flex 추가 */
  gap: 1vw; /* ✅ 섹션 사이 간격 */
  padding: 10vw 0;
  justify-content: space-between; /* ✅ 양쪽 정렬 */
  ${({ theme }) => theme.media.tablet} {
    width: 100%;
    padding: 10vw 1vw;
  }
`;

const Section = styled.section`
  flex: 1;
`;
/* color: #2c3e50; */
const WorshipInformationtitle = styled.h2`
  font-size: 1.6vw;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 0.5vw;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.3vw;
  text-align: center;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2.4vw;
  }
`;

const WorshipInformationPlace = styled.div`
  width: 100%;
  height: 2vw;
  background-color: ${(props) => props.theme.cardBgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2vw;
  margin-bottom: 0.5vw;
  padding: 1.4vw 0;
  ${({ theme }) => theme.media.tablet} {
    padding: 1.6vw 0;
  }
`;
const WorshipInformationPlaceName = styled.p`
  font-size: 1.4vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
`;

const Worshiplist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

/* color: #444; */
const Item = styled.li`
  margin-bottom: 0.5vw;
  font-size: 1.3vw;
  color: ${(props) => props.theme.textColor};
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.8vw;
  }
`;
