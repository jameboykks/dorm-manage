import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
  onClick?: () => void;
  sx?: any;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, sx }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handleClick}
      sx={{ mb: 2, ...sx }}
    >
      Quay lại
    </Button>
  );
};

export default BackButton; 