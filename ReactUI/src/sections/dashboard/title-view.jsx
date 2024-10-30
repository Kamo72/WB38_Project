import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function TitleView({ title, total, icon, color = 'primary', sx, ...other }) {
  const navigate = useNavigate();
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  
  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('email');
    navigate('/');
  };

  return (
    <Card
      component={Stack}
      spacing={3}
      direction="column"
      sx={{px: 3, py: 5, borderRadius: 2, ...sx, }}
      {...other}
    >
      {user ? (
        <>
          <Typography variant="h4">Connected! You Can Use This Website Now!</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h5">Do You Want To Logout?</Typography>
            <Button variant="contained" color="primary" onClick={handleLogout} sx={{ width: '200px' }}>
              Logout
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Typography variant="h5">You Need To Login To Use This Website</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4">Go To The Website!</Typography>
            <Button variant="contained" color="primary" onClick={handleLogin} sx={{ width: '400px' }}>
              Login
            </Button>
          </Stack>
        </>
      )}

    </Card>
  );
}

TitleView.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
