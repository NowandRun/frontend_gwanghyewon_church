import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  onAddImage: (files: FileList) => void;
  $hasThumbnail: boolean;
};

export default function ChurchBulletinBlockToolbar({ onAddImage, $hasThumbnail }: Props) {
  const handleImageClick = () => {
    // 썸네일이 이미 있는 경우: 파일창을 띄우지 않고 상태 알림만 제공
    if ($hasThumbnail) {
      alert(
        '이미지는 썸네일용으로 1개만 등록 가능합니다. 기존 이미지를 삭제 후 다시 시도해주세요.',
      );
      return;
    }
    // 썸네일이 없는 경우: 파일 선택창 실행
  };

  return (
    <ToolbarWrapper>
      <ButtonContainer>
        <ToolbarButton
          $variant="image"
          $hasThumbnail={$hasThumbnail}
          onClick={handleImageClick}
          // 등록 완료 시 시각적으로 '비활성화' 느낌을 주지만 클릭 이벤트는 유지하여 알림 제공
          style={{ opacity: $hasThumbnail ? 0.9 : 1 }}
        >
          <span className="btn-content">
            {/* 아이콘과 텍스트로 상태 직관적 전달 */}
            {$hasThumbnail ? '✅ 이미지 등록 완료' : '🖼 썸네일 추가'}
          </span>
        </ToolbarButton>

        {/* 배지: CMS상에 대표 이미지가 설정되었음을 명시 */}
        {$hasThumbnail && <Badge>대표 설정됨</Badge>}
      </ButtonContainer>

      {/* 숨겨진 파일 인풋 */}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          onAddImage(files);
          e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
        }}
      />
    </ToolbarWrapper>
  );
}

/* ==============================
   Animations
============================== */
const popIn = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
`;

const shine = keyframes`
  0% { left: -80%; }
  100% { left: 120%; }
`;

/* ==============================
   Styled Components
============================== */
const ToolbarWrapper = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px 12px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  animation: ${popIn} 0.35s ease;
  overflow: visible;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #2f80ed;
  color: white;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(47, 128, 237, 0.4);
  z-index: 20;
  pointer-events: none;
  white-space: nowrap;
`;

const ToolbarButton = styled.button<{ $variant: 'text' | 'image'; $hasThumbnail?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 160px; /* 텍스트 길이를 고려해 너비 약간 확장 */
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  /* 상태별 배경색: 등록 전(어두운 감성) vs 등록 후(진한 다크 네이비) */
  background: ${(props) => (props.$hasThumbnail ? '#1e293b' : '#111827')};

  /* 등록 완료 시 파란색 테두리로 포인트 */
  border: ${(props) => (props.$hasThumbnail ? '2px solid #2f80ed' : '1px solid #e5e7eb')};

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    border-radius: 11px;
    overflow: hidden;
    position: relative;

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
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);

    .btn-content::after {
      opacity: 1;
      animation: ${shine} 0.7s ease;
    }
  }

  &:active {
    transform: translateY(1px) scale(0.98);
  }
`;
