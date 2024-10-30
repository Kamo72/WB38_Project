import React, { useState } from 'react';
import { keyframes } from '@emotion/react';
import PropTypes from 'prop-types';
import { TextField, Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';

export default function ChangePetName({ title, subheader, handleInputChange, handleFormSubmit, petName, ...other }) {
  const [inputValue, setInputValue] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const shake = keyframes`
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
  
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
  
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  `;

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 820);
      return;
    }
    handleInputChange(inputValue);
    handleFormSubmit();
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="반려동물 이름" variant="outlined" value={inputValue} onChange={handleChange} />
          <TextField label="반려동물 이름 확인" variant="outlined" value={petName} InputProps={{readOnly: true}} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ animation: shakeError ? `${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both` : 'none' }}
          >
            Enter
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

ChangePetName.propTypes = {
  handleInputChange: PropTypes.func,
  handleFormSubmit: PropTypes.func,
  petName: PropTypes.string,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
