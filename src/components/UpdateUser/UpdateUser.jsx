import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, MenuItem, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useParams, useNavigate } from 'react-router-dom';

const Background = styled(Box)({
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const UpdateContainer = styled(Paper)({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
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

const UpdateUser = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('guest');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/get/${userId}/`);
        setUsername(response.data.username);
        setRole(response.data.role);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post(`http://localhost:8000/users/update/${userId}/`, 
        { username, role, first_name: firstName, last_name: lastName, email },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      console.log('User updated:', response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <Background>
      <UpdateContainer elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Update User
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update
          </Button>
        </form>
      </UpdateContainer>
      <Button onClick={() => navigate('/')}>Go Back</Button>
    </Background>
  );
};

export default UpdateUser;