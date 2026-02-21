import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface EditorInputProps {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const EditorInput = forwardRef<HTMLInputElement, EditorInputProps>(
  ({ placeholder, value, onChange }, ref) => {
    return (
      <Input
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  },
);

export default EditorInput;

const Input = styled.input`
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #2f80ed;
  }
`;
