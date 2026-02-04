import React from 'react';
// components/ImageBlock.tsx
import styled from 'styled-components';
import { BoardBlock } from '../../types/types';

export default function ImageBlock({
  block,
  onRemove,
}: {
  block: Extract<BoardBlock, { type: 'image' }>;
  onRemove: () => void;
}) {
  return (
    <Wrapper>
      <img src={block.previewUrl} />
      <button onClick={onRemove}>삭제</button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 24px;

  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 8px;
  }

  button {
    background: none;
    color: red;
    cursor: pointer;
  }
`;
