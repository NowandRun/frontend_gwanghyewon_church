import { ControlIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import React from 'react';
import styled, { useTheme } from 'styled-components';

function TopButton() {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    console.log(window.scrollY);
    window.addEventListener('scroll', handleShowButton);
    return () => {
      window.removeEventListener('scroll', handleShowButton);
    };
  }, []);

  return showButton ? (
    <ScrollWrapper className="scroll__container">
      <button
        id="top"
        onClick={scrollToTop}
        type="button"
      >
        <ControlIcon />
      </button>
    </ScrollWrapper>
  ) : null;
}

export default TopButton;
const ScrollWrapper = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 3rem;
  z-index: 999;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 0.5vw;
    width: 4vw;
    height: 4vw;
    border-radius: 50%;
    border: none;
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.2);
    color: black;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    svg {
      font-size: 2vw;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.35);
      transform: scale(1.1);
    }

    ${({ theme }) => theme.media.tablet} {
      background: transparent;
      width: 30px;
      height: 30px;
      svg {
        font-size: 20px;
      }
    }
  }

  ${({ theme }) => theme.media.tablet} {
    position: unset;
    bottom: unset;
    right: unset;
    z-index: unset;
  }
`;
