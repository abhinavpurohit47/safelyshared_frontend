import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Background = styled(Box)({
  background: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
});

const ListContainer = styled(Paper)({
  padding: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  maxWidth: '800px',
  width: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
      const response = await axios.get(`http://localhost:8000/api/download/${fileId}/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'downloaded_file';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
      } else if (response.headers['x-file-name']) {
        filename = response.headers['x-file-name'];
      }

      link.setAttribute('download', filename);
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
    <Background>
      <ListContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Uploaded Files
        </Typography>
        <List>
          {files.map((file) => (
            <ListItem key={file.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
              <ListItemText primary={file.file_name} secondary={new Date(file.uploaded_at).toLocaleString()} />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => handleDownload(file.id)}>
                    Download
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={() => handleGenerateDownloadLink(file.id)}>
                    Generate Download Link
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="error" onClick={() => handleDelete(file.id)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
            Go Back
          </Button>
        </Box>
      </ListContainer>
    </Background>
  );
};

export default FileList;