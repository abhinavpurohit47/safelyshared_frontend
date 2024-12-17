import React from 'react';
import { Button, Grid, Typography, Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00796b',
    },
    background: {
      default: '#f0f4f8',
    },
    text: {
      primary: '#1a1a1a',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#80cbc4',
    },
    background: {
      default: '#121212',
    },
    text: {
      primary: '#e0e0e0',
    },
  },
});

const LoadingPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(
            rgba(0, 0, 0, 0.5),
            rgba(0, 0, 0, 0.5)
          ),  no-repeat center center/cover`,
          color: darkMode ? darkTheme.palette.text.primary : lightTheme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            px: 3,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              mb: 4,
              color: darkMode ? '#80cbc4' : '#00796b',
            }}
          >
            Welcome to Safely Shared
          </Typography>

          <Typography
            variant="h6"
            sx={{ mb: 4, fontWeight: 300 }}
          >
            Manage your files, register users, and view information with ease.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/upload')}
              >
                Upload Files
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/files')}
              >
                View Files
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/register')}
              >
                Register User
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => navigate('/listUsers')}
              >
                List Users
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                onClick={() => setDarkMode(!darkMode)}
              >
                Toggle Dark Mode
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default LoadingPage;
