import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Grid,
  CircularProgress,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CryptoJS from 'crypto-js';

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

const Background = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: '20px',
}));

const ListContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: '0 auto',
  maxWidth: '800px',
}));

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/files/');
        if (Array.isArray(response.data)) {
          setFiles(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/download/${fileId}/`, 
        // {
        // responseType: 'json',
    //   });
      );

      const { iv, encrypted_content, file_name } = response.data;

      const decryptedContent = CryptoJS.AES.decrypt(
        CryptoJS.enc.Hex.parse(encrypted_content),
        CryptoJS.enc.Hex.parse(iv)
      ).toString(CryptoJS.enc.Utf8);

      const blob = new Blob([decryptedContent], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

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
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleGenerateDownloadLink = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/generate-download-link/${fileId}/`);
      const { download_url } = response.data;
      navigator.clipboard.writeText(download_url);
      alert('Download link copied to clipboard');
    } catch (error) {
      console.error('Error generating download link:', error);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Background>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ListContainer>
            <Typography variant="h4" align="center" gutterBottom>
              Uploaded Files
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {files.map((file) => (
                  <ListItem
                    key={file.id}
                    sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
                  >
                    <ListItemText
                      primary={file.file_name}
                      secondary={new Date(file.uploaded_at).toLocaleString()}
                    />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownload(file.id)}
                          fullWidth
                        >
                          Download
                        </Button>
                        <CssBaseline />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleGenerateDownloadLink(file.id)}
                          fullWidth
                        >
                          Generate Download Link
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(file.id)}
                          fullWidth
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/dashboard')}
                fullWidth
              >
                Go Back
              </Button>
            </Box>
          </ListContainer>
        </motion.div>
      </Background>
    </ThemeProvider>
  );
};

export default FileList;