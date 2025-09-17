import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Quiz', path: '/quiz' },
  { label: 'Career Mapping', path: '/career-mapping' },
  { label: 'Colleges', path: '/colleges' },
  { label: 'Scholarship', path: '/scholarship' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
];

function Navbar() {
  const location = useLocation();
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Career Path Finder
        </Typography>
        <Box>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color={location.pathname === item.path ? 'secondary' : 'inherit'}
              component={Link}
              to={item.path}
              sx={{ mx: 1 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
