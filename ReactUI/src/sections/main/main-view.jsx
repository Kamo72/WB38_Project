import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const FullScreenBox = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#D3D3D3',
}));

const LeftContainer = styled('div')(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#000084',
  flex: '66.66%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
}));

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginBottom: 120,
}));

const RightContainer = styled('div')(({ theme }) => ({
  height: '100vh',
  backgroundColor: 'black',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(3, 0),
  flex: '33.33%',
}));

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '50%',
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  width: '100%',
  marginTop: theme.spacing(5),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: '1.2rem',
  padding: theme.spacing(1, 4),
  width: '140px',
  height: '35px',
  background: '#000080',
  fontFamily: 'BOGOTA FREE', 
  margin: theme.spacing(0, 2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  fontFamily: 'Catallina',
  color: 'white',
}));

const Logo = styled('img')(({ theme }) => ({
  width: '150px',
  position: 'absolute',
  bottom: theme.spacing(10),
}));

function MainPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Catallina';
            src: url('/public/assets/font/Catallina.otf') format('opentype');
          }

          @font-face {
            font-family: 'BOGOTA FREE';
            src: url('/public/assets/font/BOGOTA FREE.ttf') format('truetype');
          }
        `}
      </style>
      
      <FullScreenBox>
        <LeftContainer>
          <LogoContainer>
            <img src="/public/assets/background/toplogo.png" alt="Logo GIF" width="200" />
          </LogoContainer>
          <img src="/public/assets/background/main.gif" alt="Main GIF" />
        </LeftContainer>

        <RightContainer>
          <ContentContainer>
            <StyledTypography variant="h4">
              Get tested
            </StyledTypography>
            <ButtonContainer>
              <StyledButton variant="contained" color="success" onClick={() => navigate('/login')}>
                Log In
              </StyledButton>
              <StyledButton variant="contained" color="success" onClick={() => navigate('/signup')}>
                Sign Up
              </StyledButton>
            </ButtonContainer>
          </ContentContainer>
          <Logo src="/public/assets/background/logo.png" alt="Main GIF" />
        </RightContainer>
      </FullScreenBox>
    </>
  );
}

export default MainPage;
