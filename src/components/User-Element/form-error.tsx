import React from 'react';
import styled from 'styled-components';

interface IFormErrorPropts {
  errorMessage?: string;
}

/* Function을 통한 error 처리하는 방법 */
export const FormError: React.FC<IFormErrorPropts> = ({ errorMessage }) => {
  if (!errorMessage) return null;
  return (
    <ErrorMessage
      role="alert"
      className="font-medium text-red-500"
    >
      {errorMessage}
    </ErrorMessage>
  );
};

const ErrorMessage = styled.span`
  color: red;
`;
