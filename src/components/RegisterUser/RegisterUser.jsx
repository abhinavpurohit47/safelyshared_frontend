import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import {useNavigate} from 'react-router-dom';
const Background = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '2rem',
  background: 'url(https://source.unsplash.com/random) no-repeat center center/cover',
});

const RegisterContainer = styled(Paper)({
  padding: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
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
    console.log('Username:', username);
    console.log('Password1:', password1);
    console.log('Password2:', password2);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Role:', role);
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post('http://localhost:8000/users/register/', 
        { username, password1, password2, first_name: firstName, last_name: lastName, email, role },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      console.log('User registered:', response.data);
    } catch (error) {
      console.error('Error registering user:', error.response.data);
    }
  };

  return (
    <Background>
      <RegisterContainer elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Role"
            select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="regular">Regular User</MenuItem>
            <MenuItem value="guest">Guest</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </RegisterContainer>
      <Button onClick={() => navigate('/')}>GO Back</Button>
    </Background>
  );
};

export default RegisterUser;