import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Quiz from './pages/Quiz';
import CareerMapping from './pages/CareerMapping';
import Colleges from './pages/Colleges';
import Scholarship from './pages/Scholarship';
import Timeline from './pages/Timeline';
import Login from './pages/Login';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    background: { default: '#f5f5e6' },
    primary: { main: '#795548' },
    secondary: { main: '#fbc02d' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/quiz" />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/career-mapping" element={<CareerMapping />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/scholarship" element={<Scholarship />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
