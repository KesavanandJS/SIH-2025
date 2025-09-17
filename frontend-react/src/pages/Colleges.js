import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Pagination } from '@mui/material';


function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/colleges-jk')
      .then(res => res.json())
      .then(data => {
        setColleges(data.colleges || []);
      })
      .catch(() => setError('Failed to load J&K colleges.'));
  }, []);

  const filtered = colleges.filter(c =>
    (!search || (c["College Name"] && c["College Name"].toLowerCase().includes(search.toLowerCase())))
  );

  // Pagination logic
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box maxWidth={1000} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Jammu & Kashmir Colleges</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Search by College Name" value={search} onChange={e => setSearch(e.target.value)} />
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#e9dec7' }}>
                {Object.keys(filtered[0] || {}).map((col, idx) => (
                  <TableCell key={idx} sx={{
                    fontWeight: 700,
                    color: col === 'Cluster' ? '#1976d2' : '#6d4c1b',
                    background: col === 'Cluster' ? '#f5ecd7' : undefined
                  }}>{col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((c, idx) => (
                <TableRow key={idx} sx={{ background: idx % 2 === 0 ? '#fffef8' : '#f5ecd7' }}>
                  {Object.entries(c).map(([col, val], i) => (
                    <TableCell key={i} sx={col === 'Cluster' ? { fontWeight: 700, color: '#1976d2', background: '#fff8ee' } : {}}>{val}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={pageCount} page={page} onChange={(_, val) => setPage(val)} color="primary" shape="rounded" />
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>Showing {paginated.length} of {filtered.length} colleges</Typography>
      </Paper>
    </Box>
  );
}

export default Colleges;
