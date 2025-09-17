import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';

function Timeline() {
  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Timeline Tracker</Typography>
        <Alert severity="info">(Coming soon) Track important admission and exam dates.</Alert>
      </Paper>
    </Box>
  );
}

export default Timeline;
