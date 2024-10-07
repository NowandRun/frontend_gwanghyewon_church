import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, Variants, Variant } from 'framer-motion';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useWindowDimensions from '../useWindowDimensions';

function Sitemap() {
  const [isOpen, setIsOpen] = useState(false);
  const width = useWindowDimensions();

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={openModal} layoutId='Sitemap'>
        <FontAwesomeIcon icon={faMapLocationDot} />
        <div>
          <span>SITEMAP</span>
          <span>전체메뉴</span>
        </div>
      </Button>
      <AnimatePresence>
        {isOpen && width >= 1300 && (
          <Overlay
            initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <ModalBox layoutId='Sitemap' />
          </Overlay>
        )}
        {isOpen && width < 1300 && (
          <Overlay
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <ModalBox
              layout={'size'} // 레이아웃 변화를 애니메이션으로 처리
              variants={modalBoxVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              transition={{
                duration: 0.3,
                type: 'tween',
                // combine opacity and scale
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
            />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sitemap;

const modalBoxVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0,
  }, // 오른쪽에서 시작
  visible: {
    x: 0,
    opacity: 1, // 원래 위치로 이동할 때 나타남
  }, // 원래 위치로 이동
  exit: {
    opacity: 0, // 나가면서 동시에 투명해짐
    x: '100%',
  }, // 오른쪽으로 나가면서 종료
};

const Button = styled(motion.div)`
  background-color: ${(props) => props.theme.cardBgColor};
  height: 120px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  font-weight: 600;
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  /* 배경색에만 트랜지션 적용 */
  transition: background-color 1s;
  /* 첫 번째 자식 요소에만 적용 */
  > :first-child {
    font-size: 30px;
    position: relative; /* position을 relative로 설정 */
    top: -4px; /* y축 방향으로 아래쪽으로 이동 */
  }
  > :last-child {
    position: relative; /* position을 relative로 설정 */
    top: 5px; /* y축 방향으로 아래쪽으로 이동 */
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1300px) {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
`;

const ModalBox = styled(motion.div)`
  background-color: ${(props) => props.theme.bgColor};
  width: 90%;
  height: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 1300px) {
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    will-change: transform, opacity; // 성능 개선을 위한 will-change 추가
    /* 모바일에서 슬라이드 애니메이션을 위한 스타일 */
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }
`;
