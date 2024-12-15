
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload/FileUpload';
import FileList from './components/FileList/FileList';
import { Box } from '@mui/material';
import Register from './components/RegisterUser/RegisterUser';
import UpdateUser from './components/UpdateUser/UpdateUser';
import ListUsers from './components/ListUsers/ListUsers';
function App() {

  return (
    <>

<Router>
<Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'url(https://source.unsplash.com/random) no-repeat center center/cover',
        }}
      >
      <Routes>
        <Route path="/" element={<FileUpload />} />
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
