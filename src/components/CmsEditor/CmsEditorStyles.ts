import styled from 'styled-components';

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const IconButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#dbeafe' : 'transparent')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#374151')};

  &:hover {
    background: #e5e7eb;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
`;

const ColorInput = styled.label`
  cursor: pointer;

  input {
    display: none;
  }
`;
export { Toolbar, IconButton, Divider, ColorInput };
