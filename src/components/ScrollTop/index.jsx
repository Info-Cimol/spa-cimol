import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import styled from 'styled-components';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const top = window.scrollY;
    if (top > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledButton
      onClick={scrollToTop}
      style={{ opacity: isVisible ? '1' : '0' }}
      title="Rolar para o Topo"
    >
      <StyledArrowUp />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0;
  background-color: #1B2F4A;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledArrowUp = styled(FaArrowUp)`
  font-size: 20px;
`;

export default ScrollToTopButton;