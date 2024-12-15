// FileUpload.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Input, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { setFile } from '../../redux/slices/fileSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const Background = styled(Box)({
  backgroundImage: 'url(https://source.unsplash.com/random)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
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
  const dispatch = useDispatch();
  const file = useSelector((state) => state.file.file);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    dispatch(setFile(file));
  };

  const handleFileUpload = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef');
        const iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(fileContent), key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
        const encryptedContent = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

        const formData = new FormData();
        formData.append('file_name', file.name);
        formData.append('encrypted_content', encryptedContent);

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
    <Background>
    <UploadContainer elevation={3}>
      <CloudUploadIcon style={{ fontSize: 50, color: '#3f51b5' }} />
      <Typography variant="h5" align="center" gutterBottom>
        Upload Your File
      </Typography>
      <Input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleFileUpload} sx={{ mt: 2 }}>
        Upload
      </Button>
      {file && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Selected file: {file.name}
        </Typography>
      )}
      <Button variant="contained" color="secondary" onClick={() => navigate('/files')} sx={{ mt: 2 }}>
        View Uploaded Files
      </Button>
      <Button variant="contained" color="secondary" onClick={() => navigate('/register')} sx={{ mt: 2 }}>
          Register User
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/listUsers')} sx={{ mt: 2 }}>
          View Users
          </Button>
    </UploadContainer>
  </Background>
  );
};

export default FileUpload;