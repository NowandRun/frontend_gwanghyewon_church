import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => (
  <button
    aria-label="submit-button"
    className={`text-lg focus:outline-none font-medium text-white py-4  transition-colors ${
      canClick ? 'bg-lime-600 hover:bg-lime-700' : 'bg-gray-300 pointer-events-none'
    }`}
  >
    {/* implementation: 삼항 조건 연산자(ternary operator) */}
    {loading ? 'Loading...' : actionText}
  </button>
);
