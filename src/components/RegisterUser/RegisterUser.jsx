import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Grid, Box, CssBaseline, MenuItem, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
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

const getCSRFToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('guest');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post(
        'http://localhost:8000/users/register/',
        { username, password1, password2, first_name: firstName, last_name: lastName, email, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      if(response.status === 201 || response.status === 200) {
        navigate('/dashboard');
      }
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Error registering user:', error.response.data);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
          ), no-repeat center center/cover`,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            px: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: 2,
            boxShadow: 3,
            py: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 4,
              color: theme.palette.primary.main,
            }}
          >
            Register User
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Role"
                  fullWidth
                  select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="regular">Regular User</MenuItem>
                  <MenuItem value="guest">Guest</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Register
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => navigate('/dashboard')} variant="text" color="primary" fullWidth>
                  Back to Home
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default RegisterUser;
