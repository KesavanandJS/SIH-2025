
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';

function Timeline() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEvents = () => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setError('Failed to load timeline events.'));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async () => {
    setError(''); setSuccess('');
    if (!event || !date) {
      setError('Please enter both event and date.');
      return;
    }
    const res = await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, date })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      setSuccess('Event added!');
      setEvent(''); setDate('');
      fetchEvents();
    } else {
      setError(data.error || 'Failed to add event.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Timeline Tracker</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField label="Event" value={event} onChange={e => setEvent(e.target.value)} fullWidth />
          <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <Button variant="contained" color="primary" onClick={handleAdd}>Add</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <List>
          {events.map((ev, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <ListItemText primary={ev.event} secondary={ev.date} />
              </ListItem>
              {idx < events.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Timeline;
