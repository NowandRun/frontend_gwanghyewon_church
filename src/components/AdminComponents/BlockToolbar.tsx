import React from 'react';
// components/BlockToolbar.tsx
import styled from 'styled-components';

export default function BlockToolbar({
  onAddText,
  onAddImage,
}: {
  onAddText: () => void;
  onAddImage: (file: File) => void;
}) {
  return (
    <Toolbar>
      <button onClick={onAddText}>텍스트 추가</button>

      <label>
        이미지 추가
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onAddImage(e.target.files[0]);
            }
          }}
        />
      </label>
    </Toolbar>
  );
}

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0;

  button,
  label {
    padding: 10px 14px;
    border-radius: 6px;
    background: #f2f4f7;
    cursor: pointer;
    font-weight: 600;
  }
`;
