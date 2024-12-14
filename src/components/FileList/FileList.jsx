// FileList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Background = styled(Box)({
  background: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const ListContainer = styled(Box)({
  padding: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  maxWidth: '600px',
  width: '100%',
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

const FileList = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/files/');
        if (Array.isArray(response.data)) {
          setFiles(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/download/${fileId}/`);
      const { file_name, content } = response.data;
      const decodedContent = CryptoJS.enc.Base64.parse(content);
      const key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef'); // Replace with your key
      const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210'); // Replace with your IV
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: decodedContent }, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
      const decryptedContent = CryptoJS.enc.Latin1.stringify(decrypted); // Use Latin1 encoding for binary data

      const url = window.URL.createObjectURL(new Blob([decryptedContent], { type: 'application/octet-stream' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const csrfToken = getCSRFToken();
      await axios.delete(`http://localhost:8000/api/delete/${fileId}/`, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <Background>
      <ListContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.file_name} secondary={new Date(file.uploaded_at).toLocaleString()} />
              <Button variant="contained" color="primary" onClick={() => handleDownload(file.id)}>
                Download
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleDelete(file.id)}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </ListContainer>
      <Button variant="contained" color="secondary" onClick={() => navigate('/')}> Go Back </Button>
    </Background>
  );
};

export default FileList;