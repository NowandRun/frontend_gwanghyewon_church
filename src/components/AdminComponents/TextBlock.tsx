import React from 'react';
// components/TextBlock.tsx
import styled from 'styled-components';
import { BoardBlock } from '../../types/types';

export default function TextBlock({
  block,
  onChange,
}: {
  block: Extract<BoardBlock, { type: 'text' }>;
  onChange: (value: string) => void;
}) {
  return (
    <Textarea
      placeholder="내용을 입력하세요"
      value={block.content}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px;
  margin-bottom: 20px;
  font-size: 15px;
`;
