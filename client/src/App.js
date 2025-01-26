import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';  // Your Login component
import Register from './Register';  // Your Register component
import DiaryEntries from './DiaryEntries';  // Your DiaryEntries component

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect to Login Page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Route for Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Route for Register Page */}
        <Route path="/register" element={<Register />} />

        {/* Route for Diary Entries Page (Protected) */}
        <Route path="/diary-entries" element={<DiaryEntries />} />
      </Routes>
    </Router>
  );
}

export default App;
