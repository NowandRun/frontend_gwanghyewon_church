// components/AdminComponents/EditorInput.tsx
import React, { forwardRef } from 'react';
import styled from 'styled-components';

type EditorInputProps = {
  placeholder?: string;
};

const EditorInput = forwardRef<HTMLInputElement, EditorInputProps>(({ placeholder }, ref) => {
  return (
    <Input
      ref={ref}
      placeholder={placeholder}
    />
  );
});

export default EditorInput;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 14px;

  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;

  &:focus {
    outline: none;
    border-color: #2f80ed;
  }
`;
