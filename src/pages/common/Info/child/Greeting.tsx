import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

function Greeting() {
  return (
    <GreetingWrapper>
      <GreetingTitle>담임목사 인사말</GreetingTitle>
      <GreetingImgWrapper>
        <GreetingImg
          src={
            process.env.PUBLIC_URL +
            '/images/SubPage/Pastor-is-famous-quotes/250929-담임목사-인사말2.png'
          }
          alt="담임목사 인사말"
        />
        <GreetingImgTextWrapper>
          <GreetingImgTextOne
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            "주님과 동행하는 교회"
          </GreetingImgTextOne>
          <GreetingImgTextTwo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            광혜원순복음교회
          </GreetingImgTextTwo>
        </GreetingImgTextWrapper>
      </GreetingImgWrapper>
      <GreetingMainTextWrapper>
        <GreetingMainBordBigText>
          {`할렐루야! 광혜원순복음교회를 찾아주신 여러분을 주님의 이름으로 진심으로 환영하고 축복합니다.`}
        </GreetingMainBordBigText>
        <GreetingMainBordSmallText>
          {`저희 교회는 하나님의 사랑 안에서 지역 사회와 함께 성장하며,
          예수 그리스도의 복음을 전하는 사명을 감당하고 있습니다.
          
          이곳에서 여러분은 따뜻한 영적 교제와 깊이 있는 말씀, 
          그리고 살아계신 하나님의 역사를 경험하게 될 것입니다. 
          
          광혜원순복음교회는 모든 성도님들이 영적으로 성숙하고,
          믿음 안에서 든든히 서 갈 수 있도록 돕는 데 최선을 다하고 있습니다. 
          
          삶의 기쁨과 위로, 
          그리고 진정한 행복을 찾고 계시다면 언제든지 저희 교회의 문을 두드려 주시길 바랍니다.
          
          하나님의 은혜와 평강이 여러분과 가정에 늘 충만하시기를 기도합니다.`}
        </GreetingMainBordSmallText>
      </GreetingMainTextWrapper>
    </GreetingWrapper>
  );
}

export default Greeting;

const GreetingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
`;

const GreetingTitle = styled.div`
  font-size: 1.5vw;
  height: 3vw;
  padding: 2vw 0;
  display: flex;
  align-items: center;
`;

const GreetingImgWrapper = styled.div`
  background-color: black;
  display: flex;
`;

const GreetingImg = styled.img`
  width: 40%;
  height: auto;
  display: block;
`;

const GreetingImgTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1vw;
`;

// ✅ motion.span으로 변경
const GreetingImgTextOne = styled(motion.span)`
  color: white;
  display: block;
  font-size: 1.2vw;
`;

const GreetingImgTextTwo = styled(motion.span)`
  color: white;
  display: block;
  font-size: 2.5vw;
`;

const GreetingMainTextWrapper = styled.div`
  margin-top: 2vw;
`;

const GreetingMainBordBigText = styled.p`
  font-size: 1.1vw;
  line-height: 1.8; /* ✅ 줄 간격 넉넉히 */
  color: #333;
  white-space: pre-line; /* ✅ \n 줄바꿈 적용 */
`;

const GreetingMainBordSmallText = styled.p`
  font-size: 1vw;
  margin-top: 1.5vw;
  white-space: pre-line; /* ✅ \n 줄바꿈 적용 */
`;
