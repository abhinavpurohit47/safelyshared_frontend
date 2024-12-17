
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload/FileUpload';
import FileList from './components/FileList/FileList';
import { Box } from '@mui/material';
import Register from './components/RegisterUser/RegisterUser';
import UpdateUser from './components/UpdateUser/UpdateUser';
import ListUsers from './components/ListUsers/ListUsers';
import LoadingPage from './components/LoadingPage/LoadingPage';
import { useState } from 'react';
import LoginUser from './components/LoginUser/LoginUser';
function App() {
  // eslint-disable-next-line no-unused-vars
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>

<Router>
<Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '100vh',
          background: darkMode ? '#121212' : '#f5f5f5',
        }}
      >
      <Routes>
      <Route path="/" element={<LoginUser />} />
      <Route path="/dashboard" element={<LoadingPage />} />
      <Route path="/upload" element={<FileUpload />} />
        <Route path="/files" element={<FileList />} />
        <Route path="/register" element={<Register />} />
        <Route path='/updateUser' element={<UpdateUser />} />
        <Route path='/listUsers' element={<ListUsers />} />

      </Routes>
      </Box>
    </Router>
    </>
  )
}

export default App
