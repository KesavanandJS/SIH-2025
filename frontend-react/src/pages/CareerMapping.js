import React, { useState } from 'react';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';

const streams = ['Science', 'Commerce', 'Arts', 'Vocational'];

function CareerMapping() {
  const [stream, setStream] = useState('Science');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      const res = await fetch(`/api/career-mapping?stream=${stream}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Failed to fetch career mapping.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3, boxShadow: 4, borderRadius: 3, background: '#fffef8' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 700, textAlign: 'center', mb: 3 }}>Course-to-Career Mapping</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Stream</InputLabel>
          <Select value={stream} label="Stream" onChange={e => setStream(e.target.value)}>
            {streams.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mb: 2, fontWeight: 600 }}>Show Mapping</Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && (
          <Box mt={3}>
            <Typography variant="h6">Career Path:</Typography>
            {result.mapping && result.mapping.length > 0 ? (
              <Box>
                {result.mapping.map(([from, to], idx) => (
                  <Box key={idx} display="flex" alignItems="center" mb={1}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{from}</Typography>
                    <Typography variant="body1" sx={{ mx: 1 }}>→</Typography>
                    <Typography variant="body1">{to}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No mapping found for this stream.</Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default CareerMapping;
