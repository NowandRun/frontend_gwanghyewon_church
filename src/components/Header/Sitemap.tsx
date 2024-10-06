import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Sitemap() {
  const [isOpen, setIsOpen] = useState(false);
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
        {isOpen && (
          <Overlay
            initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={closeModal}
          >
            <ModalBox layoutId='Sitemap' />
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sitemap;

const Button = styled(motion.div)`
  background-color: ${(props) => props.theme.cardBgColor};
  height: 150px;
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
  /* 첫 번째 자식 요소에만 적용 */
  > :first-child {
    font-size: 30px;
    position: relative; /* position을 relative로 설정 */
    top: 10px; /* y축 방향으로 아래쪽으로 이동 */
  }
  > :last-child {
    position: relative; /* position을 relative로 설정 */
    top: 20px; /* y축 방향으로 아래쪽으로 이동 */
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
`;

const ModalBox = styled(motion.div)`
  background-color: ${(props) => props.theme.bgColor};
  width: 90%;
  height: 80%;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.06);
`;
