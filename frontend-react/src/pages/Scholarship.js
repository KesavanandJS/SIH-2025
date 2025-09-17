import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';

function Scholarship() {
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Scholarship & Cost Estimator</Typography>
        <Alert severity="info">(Coming soon) Calculate your net cost after scholarships.</Alert>
      </Paper>
    </Box>
  );
}

export default Scholarship;
