import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  onAddImage: (files: FileList) => void;
};

export default function ChurchMainPopupBlockToolbar({ onAddImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <ToolbarWrapper>
      <ToolbarButton
        $variant="image"
        onClick={() => fileInputRef.current?.click()}
      >
        🖼 이미지 추가
      </ToolbarButton>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;

          onAddImage(files);

          e.target.value = '';
        }}
      />
    </ToolbarWrapper>
  );
}

/* ==============================
   Animations
============================== */

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`;

const shine = keyframes`
  0% {
    left: -80%;
  }
  100% {
    left: 120%;
  }
`;

/* ==============================
   Styled Components
============================== */

const ToolbarWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;

  padding: 14px 12px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;

  animation: ${popIn} 0.35s ease;
`;

const ToolbarButton = styled.button<{ $variant: 'text' | 'image'; $hasThumbnail?: boolean }>`
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  height: 44px;
  min-width: 140px;

  border-radius: 12px;
  border: 1px solid #e5e7eb;

  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  background: ${(props) => (props.$variant === 'text' ? '#2563eb' : '#111827')};
  color: white;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }

  /* ✅ 버튼 위로 빛이 지나가는 애니메이션 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -80%;
    width: 70%;
    height: 100%;
    transform: skewX(-25deg);

    background: rgba(255, 255, 255, 0.3);
    filter: blur(4px);

    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
    animation: ${shine} 0.7s ease;
  }

  border: ${(props) => (props.$hasThumbnail ? '2px solid #2f80ed' : '1px solid #e5e7eb')};
  position: relative;

  &::after {
    content: '${(props) => (props.$hasThumbnail ? '썸네일 선택됨' : '')}';
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: #2f80ed;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 4px;
    border-radius: 4px;
  }
`;
