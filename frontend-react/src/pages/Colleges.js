import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [state, setState] = useState('All');
  const [search, setSearch] = useState('');
  const [states, setStates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/colleges')
      .then(res => res.json())
      .then(data => {
        setColleges(data);
        const uniqueStates = Array.from(new Set(data.map(c => c.state))).sort();
        setStates(['All', ...uniqueStates]);
      })
      .catch(() => setError('Failed to load colleges.'));
  }, []);

  const filtered = colleges.filter(c =>
    (state === 'All' || c.state === state) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box maxWidth={1000} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Top Engineering Colleges</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>State</InputLabel>
            <Select value={state} label="State" onChange={e => setState(e.target.value)}>
              {states.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Search by College Name" value={search} onChange={e => setSearch(e.target.value)} />
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>College Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c, idx) => (
                <TableRow key={idx}>
                  <TableCell>{c.rank}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.owner_ship}</TableCell>
                  <TableCell>{c.grade}</TableCell>
                  <TableCell>{c.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={{ mt: 2 }}>Showing {filtered.length} colleges</Typography>
      </Paper>
    </Box>
  );
}

export default Colleges;
