import React, { useState } from 'react';
import { Box, Button, Input, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Background = styled(Box)({
  // backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const UploadContainer = styled(Paper)({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  maxWidth: '400px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
});

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      // Implement file upload logic here
      console.log('File ready for upload:', file);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <Background>
      <UploadContainer elevation={3}>
        <CloudUploadIcon style={{ fontSize: 50, color: '#3f51b5' }} />
        <Typography variant="h5" align="center" gutterBottom>
          Upload Your File
        </Typography>
        <Input type="file" onChange={handleFileChange} />
        <Button variant="contained" color="primary" onClick={handleFileUpload}>
          Upload
        </Button>
        {file && (
          <Typography variant="body2" color="textSecondary">
            Selected file: {file.name}
          </Typography>
        )}
      </UploadContainer>
    </Background>
  );
};

export default FileUpload;