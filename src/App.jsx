import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './components/FileUpload/FileUpload';
import FileList from './components/FileList/FileList';
function App() {

  return (
    <>

<Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/files" element={<FileList />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
