import { NotePencilIcon } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

function Guide() {
  return (
    <GuideWrapper>
      <GuideTitle>예배안내</GuideTitle>
      <GuideImgWrapper>
        <GuideImg
          src={process.env.PUBLIC_URL + '/images/SubPage/예배안내/251008-예배안내-image.jpg'}
          alt="담임목사 인사말"
        />
        <GuideImgTextWrapper>
          <GuideImgTextOne
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Worship time service
          </GuideImgTextOne>
          <GuideImgTextTwo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            광혜원순복음교회 예배시간 및 장소 안내해드립니다
          </GuideImgTextTwo>
        </GuideImgTextWrapper>
      </GuideImgWrapper>

      {/* ✅ 예배 안내 표 영역 */}
      <ServiceSection>
        {/* ===== 주일예배 ===== */}

        {/* Header 내부 요소는 위 → 아래 */}
        <ServiceHeader>
          <HeaderContent
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceIcon>
              <NotePencilIcon />
            </ServiceIcon>
            주일예배
          </HeaderContent>
        </ServiceHeader>
        <MotionBlock
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ServiceTable>
            <tbody>
              <tr>
                <LeftCell rowSpan={3}>주일낮예배</LeftCell>
                <RightCell>1부</RightCell>
                <RightCell>오전 09:00</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
              <tr>
                <RightCell>2부</RightCell>
                <RightCell>오전 11:00</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
              <tr>
                <RightCell>바이블아카데미</RightCell>
                <RightCell>오후 01:30</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
            </tbody>
          </ServiceTable>
        </MotionBlock>

        {/* Header 내부 요소는 위 → 아래 */}
        <ServiceHeader>
          <HeaderContent
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceIcon>
              <NotePencilIcon />
            </ServiceIcon>
            수요 및 금요성령집회
          </HeaderContent>
        </ServiceHeader>
        {/* ===== 수요 및 금요성령집회 ===== */}
        <MotionBlock
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <ServiceTable>
            <tbody>
              <tr>
                <LeftCell rowSpan={2}>수요예배</LeftCell>
                <RightCell></RightCell>
                <RightCell>저녁 07:30</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
              <tr>
                <RightCell></RightCell>
                <RightCell>저녁 08:30</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
            </tbody>
          </ServiceTable>
        </MotionBlock>

        {/* Header 내부 요소는 위 → 아래 */}
        <ServiceHeader>
          <HeaderContent
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceIcon>
              <NotePencilIcon />
            </ServiceIcon>
            새벽기도회
          </HeaderContent>
        </ServiceHeader>
        {/* ===== 새벽기도회 ===== */}
        <MotionBlock
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          <ServiceTable>
            <tbody>
              <tr>
                <LeftCell>새벽기도회</LeftCell>
                <RightCell></RightCell>
                <RightCell>월~금 매주 새벽 05:00</RightCell>
                <RightCell>3층 대예배실</RightCell>
              </tr>
            </tbody>
          </ServiceTable>
        </MotionBlock>

        {/* Header 내부 요소는 위 → 아래 */}
        <ServiceHeader>
          <HeaderContent
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceIcon>
              <NotePencilIcon />
            </ServiceIcon>
            교회학교
          </HeaderContent>
        </ServiceHeader>
        {/* ===== 교회학교 ===== */}
        <MotionBlock
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          <ServiceTable>
            <tbody>
              <tr>
                <LeftCell rowSpan={3}>교회학교</LeftCell>
                <RightCell>하꿈주일학교</RightCell>
                <RightCell>오전 10:20</RightCell>
                <RightCell>2층 하꿈예배실</RightCell>
              </tr>
              <tr>
                <RightCell>예람학생부</RightCell>
                <RightCell>오후 01:20</RightCell>
                <RightCell>2층 예람예배실</RightCell>
              </tr>
              <tr>
                <RightCell>하람청년부</RightCell>
                <RightCell>오후 01:20</RightCell>
                <RightCell>2층 하람예배실</RightCell>
              </tr>
            </tbody>
          </ServiceTable>
        </MotionBlock>

        {/* ===== 교회시설 안내 ===== */}
        <ServiceHeader>
          <HeaderContent
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceIcon>
              <NotePencilIcon />
            </ServiceIcon>
            교회시설 안내
          </HeaderContent>
        </ServiceHeader>

        <MotionBlock
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          <FacilityGrid>
            <FacilityCard>
              <FacilityTitle>본당</FacilityTitle>
              <FacilityImg
                src={process.env.PUBLIC_URL + '/images/facilities/본당.JPG'}
                alt="본당"
              />
            </FacilityCard>

            <FacilityCard>
              <FacilityTitle>유초등부실</FacilityTitle>
              <FacilityImg
                src={process.env.PUBLIC_URL + '/images/facilities/유초등부실.jpg'}
                alt="유초등부실"
              />
            </FacilityCard>

            <FacilityCard>
              <FacilityTitle>학생청년부실</FacilityTitle>
              <FacilityImg
                src={process.env.PUBLIC_URL + '/images/facilities/학생청년부실.jpg'}
                alt="학생청년부실"
              />
            </FacilityCard>

            <FacilityCard>
              <FacilityTitle>카페</FacilityTitle>
              <FacilityImg
                src={process.env.PUBLIC_URL + '/images/facilities/카페.jpg'}
                alt="카페"
              />
            </FacilityCard>
          </FacilityGrid>
        </MotionBlock>
      </ServiceSection>
    </GuideWrapper>
  );
}

export default Guide;

const GuideWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }

  ${({ theme }) => theme.media.mobile} {
    position: static; /* ✅ sticky로 변경 */
  }
`;
const GuideTitle = styled.div`
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

const GuideImgWrapper = styled.div`
  position: relative; /* ✅ 이미지와 텍스트 겹침 가능 */
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vw;
  overflow: hidden; /* 이미지 영역 벗어나지 않도록 */
`;

const GuideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* ✅ 부모 크기에 맞게 확대/축소 */
  display: flex;
  opacity: 0.5; /* ✅ 0~1 사이 값, 낮을수록 투명 */
`;

const GuideImgTextWrapper = styled.div`
  position: absolute; /* ✅ 이미지 위로 올림 */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ 중앙 정렬 */
  text-align: center;
`;

// ✅ motion.span으로 변경
const GuideImgTextOne = styled(motion.span)`
  color: white;
  text-transform: uppercase; /* ✅ 텍스트를 모두 대문자로 변환 */
  font-size: 2.5vw;
  font-weight: 900;
  ${({ theme }) => theme.media.tablet} {
    font-size: 3.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 3.7vw;
  }
`;

const GuideImgTextTwo = styled(motion.span)`
  color: white;
  display: block;
  font-size: 1.3vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

/* ✅ Motion Block (각 섹션의 등장 애니메이션을 감싸는 Wrapper) */
const MotionBlock = styled(motion.div)`
  margin-bottom: 4vw;
`;

/* ✅ 표 스타일 */
const ServiceSection = styled.div`
  width: 100%;
  background-color: #ffffff;
`;

const HeaderContent = styled(motion.div)`
  display: flex;
  align-items: center;
`;

const ServiceHeader = styled.div`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  font-weight: 700;
  font-size: 1.8vw;
  display: flex;
  align-items: center;
  padding: 1vw 2vw;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.2vw;
  }
`;

const ServiceIcon = styled.span`
  font-size: 2vw;
  margin-right: 0.7vw;
`;

const ServiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.1vw;
  text-align: center;
  color: #222;

  tr {
    border-bottom: 1px solid #e0e0e0;
  }

  td {
    padding: 1vw;
  }

  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const LeftCell = styled.td`
  width: 15%;
  background-color: #f4f4f4;
  font-weight: 700;
  font-size: 1.1vw;
  border-right: 1px solid #e0e0e0;
  vertical-align: middle;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.5vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2vw;
  }
`;

const RightCell = styled.td`
  width: 25%;
`;

const FacilityGrid = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2vw;

  ${({ theme }) => theme.media.tablet} {
  }

  ${({ theme }) => theme.media.mobile} {
  }
`;

const FacilityCard = styled.div`
  background-color: #ffffff;
`;

const FacilityImg = styled.img`
  width: 100%;
  height: 30vw;
  object-fit: cover;
  ${({ theme }) => theme.media.tablet} {
    height: 25vw;
  }
  ${({ theme }) => theme.media.mobile} {
    height: 45vw;
  }
`;

const FacilityTitle = styled.div`
  font-size: 1.5vw;
  font-weight: 700;
  padding: 1vw 0;
  color: #333;
  text-align: center;
  ${({ theme }) => theme.media.tablet} {
    font-size: 1.9vw;
  }
  ${({ theme }) => theme.media.mobile} {
    font-size: 2.4vw;
  }
`;
