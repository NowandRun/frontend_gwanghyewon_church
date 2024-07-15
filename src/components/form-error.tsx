import React from 'react';

interface IFormErrorPropts {
  errorMessage: string;
}

/* Function을 통한 error 처리하는 방법 */
export const FormError: React.FC<IFormErrorPropts> = ({ errorMessage }) => (
  <span role='alert' className='font-medium text-red-500'>
    {errorMessage}
  </span>
);
