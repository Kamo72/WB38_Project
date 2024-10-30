import React, { useState } from 'react';
import { Box, Card, Stack, TextField, Typography, Button, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function ProfileView() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordafter, setPasswordafter] = useState('');

  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (selectedButton === "Modify Email") {
      const updateEmail = {
        user,
        email,
        password,
      };
    
      fetch('http://127.0.0.1:3005/auth/update_email_process',{
        method: 'POST',
        body: JSON.stringify(updateEmail),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if(!response.ok){
          throw new Error(response.status)
        }
        return response.json()
      })
      .then(data => {
          setEmail('');
          setPassword('');
          sessionStorage.setItem('email', JSON.stringify(updateEmail.email));
          alert(data.message);
      })
      .catch(error => console.error('Error:', error));
    }

    if (selectedButton === "Modify Password") {
      const updatePassword = {
        user,
        password,
        passwordafter,
      };

      fetch('http://127.0.0.1:3005/auth/update_password_process',{
        method: 'POST',
        body: JSON.stringify(updatePassword),
        credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.body.data)
        if(!response.ok){
          throw new Error(response.status)
        }
        return response.json()
      })
      .then(data => {
        setPassword('');
        setPasswordafter('');
        alert(data.message);
      })
    }
  };

  const renderForm = () => {
    if (selectedButton === "Modify Email") {
      return (
        <form onSubmit={handleProfileUpdate}>
          <Stack spacing={3}>
            <TextField
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 3, mb: 2 }}
            >
              Enter
            </Button>
          </Stack>
        </form>
      );
    }

    if (selectedButton === "Modify Password") {
      return (
        <form onSubmit={handleProfileUpdate}>
          <Stack spacing={3}>
            <TextField
              name="password"
              label="Before password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              name="passwordafter"
              label="After password"
              type="password"
              value={passwordafter}
              onChange={(e) => setPasswordafter(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 3, mb: 2 }}
            >
              Enter
            </Button>
          </Stack>
        </form>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ p: 5, width: '100%', maxWidth: 420 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
          }}
        >
          <Typography variant="h4">
            Profile
          </Typography>
          <Link component={RouterLink} to="/dashboard">
            <IconButton>
              <img src="/favicon/favicon.ico" alt="Dashboard" />
            </IconButton>
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Button 
            type="button" 
            variant="contained" 
            sx={{ mt: 3, width: '45%' }}
            onClick={() => handleButtonClick("Modify Email")}
          >
            Modify Email
          </Button>
          <Button 
            type="button" 
            variant="contained" 
            sx={{ mt: 3, width: '45%' }}
            onClick={() => handleButtonClick("Modify Password")}
          >
            Modify Password
          </Button>
        </Box>
        {selectedButton && renderForm()}
      </Card>
    </Box>
  );
}

export default ProfileView;
