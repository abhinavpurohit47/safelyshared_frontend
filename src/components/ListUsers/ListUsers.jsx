import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import { useHistory } from 'react-router-dom';

const Background = styled(Box)({
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ListContainer = styled(Paper)({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  maxWidth: '800px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
});

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/list/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = (userId) => {
    history.push(`/update/${userId}`);
  };

  return (
    <Background>
      <ListContainer elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          List of Users
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(user.id)}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ListContainer>
    </Background>
  );
};

export default ListUsers;