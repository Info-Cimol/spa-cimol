import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackArrow = () => {
  const handleGoBack = () => {
    window.location.reload();
  };

  return (
    <IconButton onClick={handleGoBack} aria-label="Voltar">
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackArrow;