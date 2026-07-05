import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface PopupProps {
  id: number;
  index: number;
  title: string;
  blocks: {
    landscape: { url: string };
    portrait: { url: string };
  };
}

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

export const MainPopupModule = ({ id, index, title, blocks }: PopupProps) => {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentImage = isLandscape
    ? blocks?.landscape?.url || blocks?.portrait?.url
    : blocks?.portrait?.url || blocks?.landscape?.url;

  return (
    <PopupContainer>
      <ContentArea>
        {currentImage && (
          <img
            src={currentImage}
            alt={title}
            key={isLandscape ? 'land' : 'port'}
          />
        )}
      </ContentArea>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);

  /* 부모인 CardWrapper(76vw)를 100% 채우도록 수정 */
  width: 100%;
  height: 80vh; /* 화면 높이에 맞춰 적절히 조절 */

  flex-shrink: 0;
  animation: ${scaleIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  /* 모바일에서도 부모 너비를 그대로 따라가도록 설정 */
  ${({ theme }) => theme.media?.mobile || '@media (max-width: 768px)'} {
    width: 100%;
    height: 70vh;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden; 
  background: #000; /* 빈 공간(레터박스)이 생길 때 노출될 배경색 */
  display: flex; 
  justify-content: center; /* 가로 중앙 정렬 추가 */
  align-items: center;     /* 세로 중앙 정렬 추가 */
  
  img {
    width: 100%;
    height: 100%;
    /* 핵심 수정: cover -> contain 으로 변경하여 이미지가 잘리지 않게 함 */
    object-fit: contain; 
    display: block;
  }
`;