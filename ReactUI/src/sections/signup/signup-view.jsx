import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

export default function SignUpView() {
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const logup = (Id, Pw, Pw2, Em) => {
    fetch('http://127.0.0.1:3005/auth/register_process', {
      method: 'POST',
      body: JSON.stringify({ username: Id, password: Pw, password2: Pw2, email: Em }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    })
    .catch((error) => {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    });
  };

  const handleClick = (event) => {
    event.preventDefault();

    if (password !== password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    logup(username, password, password2, email);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="password2"
          label="Confirm Password"
          type={showPassword2 ? 'text' : 'password'}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                  <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box mt={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          Sign Up
        </LoadingButton>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign Up</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Already have an account ? {" "}
            <RouterLink to="/login" variant="subtitle2" sx={{ ml: 0.5 }}>
              Sign in
            </RouterLink>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
