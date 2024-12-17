
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Box, Button, Typography, Input, ThemeProvider, createTheme, CssBaseline, Grid } from '@mui/material';
import { setFile } from '../../redux/slices/fileSlice';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { encryptFileContent, fetchEncryptionKey } from '../../encryption';
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

const FileUpload = () => {
  useEffect(() => {
    const fetchKey = async () => {
      await fetchEncryptionKey();
    };
    fetchKey();
  }, []);
  const dispatch = useDispatch();
  const file = useSelector((state) => state.file.file);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    dispatch(setFile(file));
  };
  const handleFileUpload = async () => {
    if (file) {
      await fetchEncryptionKey();
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const fileContent = CryptoJS.enc.Utf8.parse(e.target.result);
        const { iv, ciphertext } = encryptFileContent(fileContent);
  
        const formData = new FormData();
        formData.append('file_name', file.name);
        formData.append('encrypted_content', ciphertext);
        formData.append('iv', iv);
  
        try {
          const csrfToken = getCSRFToken();
          const response = await axios.post('http://localhost:8000/api/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-CSRFToken': csrfToken,
            },
            withCredentials: true,
          });
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
  
      reader.readAsText(file);
    } else {
      console.log('No file selected');
    }
  };
  

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
            ), no-repeat center center/cover`,
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
              Upload Your Files
            </Typography>
  
            <Typography
              variant="h6"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Select a file to upload, then proceed to manage your files or navigate to other sections.
            </Typography>
  
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  sx={{
                    display: 'block',
                    mx: 'auto',
                    border: '1px solid',
                    borderColor: darkMode ? '#80cbc4' : '#00796b',
                    borderRadius: 2,
                    padding: 1,
                    color: darkMode ? '#e0e0e0' : '#1a1a1a',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleFileUpload}
                  sx={{ mt: 2 }}
                >
                  Upload File
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => navigate('/files')}
                  sx={{ mt: 2 }}
                >
                  View Files
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
  
            {file && (
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  mt: 4,
                  fontStyle: 'italic',
                  color: darkMode ? '#80cbc4' : '#00796b',
                }}
              >
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        </Grid>
      </ThemeProvider>
    );
};

export default FileUpload;