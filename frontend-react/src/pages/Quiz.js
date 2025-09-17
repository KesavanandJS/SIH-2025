
import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Alert, LinearProgress, Stepper, Step, StepLabel, Tooltip } from '@mui/material';

const questions = [
  'Do you enjoy solving math and science problems?',
  'Are you interested in business, finance, or economics?',
  'Do you like reading literature, history, or philosophy?',
  'Are you passionate about art, music, or design?',
  'Do you enjoy working with computers or technology?',
  'Are you interested in hands-on vocational skills (mechanic, electrician, etc.)?',
  'Do you like helping people (teaching, healthcare, social work)?',
];

const options = ['Yes', 'No', 'Sometimes'];

function Quiz() {

  const [responses, setResponses] = useState(Array(questions.length).fill(''));
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const handleChange = (idx, value) => {
    const newResponses = [...responses];
    newResponses[idx] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (!responses[step]) {
      setError('Please select an option.');
      return;
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (responses.includes('')) {
      setError('Please answer all questions.');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      const data = await res.json();
      setResult({
        top_streams: data.recommended,
        stream_scores: data.scores
      });
    } catch (e) {
      setError('Failed to get prediction.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3, boxShadow: 4, borderRadius: 3, background: '#fffef8' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 700, textAlign: 'center', mb: 3 }}>Aptitude Quiz</Typography>
        {!result ? (
          <>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
              {questions.map((_, idx) => (
                <Step key={idx}>
                  <StepLabel></StepLabel>
                </Step>
              ))}
            </Stepper>
            <LinearProgress variant="determinate" value={((step + 1) / questions.length) * 100} sx={{ mb: 2, height: 8, borderRadius: 2, background: '#f5ecd7' }} />
            <Box sx={{ mb: 2, mt: 2 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{questions[step]}</FormLabel>
                <RadioGroup
                  row
                  value={responses[step]}
                  onChange={e => handleChange(step, e.target.value)}
                  sx={{ mt: 2 }}
                >
                  {options.map(opt => (
                    <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" color="primary" disabled={step === 0} onClick={handleBack}>Previous</Button>
              {step < questions.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Quiz</Button>
              )}
            </Box>
          </>
        ) : (
          <Box mt={3}>
            <Typography variant="h6" sx={{ mb: 2, color: '#b89b5e', fontWeight: 700 }}>🎉 Your Recommended Streams</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
              {result.top_streams?.map((s, i) => (
                <Box key={s} sx={{
                  background: i === 0 ? '#f5ecd7' : '#fff8ee',
                  color: '#6d4c1b',
                  px: 4, py: 2, borderRadius: 2, fontSize: '1.2rem', fontWeight: 600
                }}>{s}</Box>
              ))}
            </Box>
            <Typography sx={{ fontWeight: 500, mb: 1 }}>Stream Scores</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              {Object.entries(result.stream_scores || {}).map(([stream, score]) => (
                <Box key={stream} sx={{ background: '#f5ecd7', px: 2, py: 1, borderRadius: 1, color: '#6d4c1b', fontSize: '1rem' }}>
                  {stream}: <b>{score}</b>
                </Box>
              ))}
            </Box>
            {/* Compare Streams & Careers Table */}
            <Typography sx={{ fontWeight: 600, mb: 1 }}>Compare Streams & Careers</Typography>
            <Box sx={{ overflowX: 'auto', mb: 3 }}>
              <table style={{ margin: '0 auto', minWidth: 600, background: '#fff8ee' }}>
                <thead>
                  <tr style={{ background: '#e9dec7', color: '#6d4c1b' }}>
                    <th>Stream</th><th>Popular Degrees</th><th>Example Careers</th><th>Govt. Exams/Jobs</th><th>Private Sector</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries({
                    'Science': {
                      degrees: 'B.Sc., B.Tech, MBBS, BDS, B.Pharm',
                      careers: 'Engineer, Doctor, Scientist, Pharmacist, Researcher',
                      govt: 'NEET, JEE, UPSC, SSC, State PSC, DRDO',
                      private: 'IT, Healthcare, R&D, Pharma, EdTech'
                    },
                    'Commerce': {
                      degrees: 'B.Com, BBA, CA, CS, BMS',
                      careers: 'Accountant, Banker, CA, Business Analyst, Manager',
                      govt: 'Bank PO, SSC, UPSC, State PSC, RBI',
                      private: 'Finance, Banking, Business, Retail, Startups'
                    },
                    'Arts': {
                      degrees: 'B.A., BFA, BSW, LLB, BJMC',
                      careers: 'Teacher, Lawyer, Journalist, Designer, Social Worker',
                      govt: 'UPSC, SSC, State PSC, Teaching, Law',
                      private: 'Media, Design, NGOs, Content, HR'
                    },
                    'Vocational': {
                      degrees: 'Diploma, ITI, B.Voc, Skill Cert.',
                      careers: 'Technician, Electrician, Chef, Paramedic, Entrepreneur',
                      govt: 'Skill India, SSC, Railways, State PSC',
                      private: 'Hospitality, Healthcare, Trades, Startups'
                    }
                  }).map(([stream, info]) => (
                    <tr key={stream}>
                      <td><b>{stream}</b></td>
                      <td>{info.degrees}</td>
                      <td>{info.careers}</td>
                      <td>{info.govt}</td>
                      <td>{info.private}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            {/* Top College Recommendations (static demo) */}
            <Typography sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>🎯 Top College Recommendations</Typography>
            <Box sx={{ mb: 2 }}>
              <table style={{ margin: '0 auto', minWidth: 400, background: '#fff8ee' }}>
                <thead>
                  <tr style={{ background: '#e9dec7', color: '#6d4c1b' }}>
                    <th>Rank</th><th>College Name</th><th>Type</th><th>Grade</th><th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>IIT Madras - Indian Institute of Technology</td><td>Public/Government</td><td>AAAAA</td><td>90.04</td></tr>
                  <tr><td>2</td><td>IIT Delhi - Indian Institute of Technology</td><td>Public/Government</td><td>AAAAA</td><td>88.12</td></tr>
                  <tr><td>3</td><td>IIT Bombay - Indian Institute of Technology</td><td>Public/Government</td><td>AAAAA</td><td>83.96</td></tr>
                  <tr><td>4</td><td>IIT Kanpur - Indian Institute of Technology</td><td>Public/Government</td><td>AAAAA</td><td>82.56</td></tr>
                  <tr><td>5</td><td>IIT Kharagpur - Indian Institute of Technology</td><td>Public/Government</td><td>AAAAA</td><td>78.89</td></tr>
                </tbody>
              </table>
            </Box>
            {/* Suggested Degree Programs */}
            <Typography sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>🎓 Suggested Degree Programs</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ background: '#e3f2fd', color: '#1976d2', px: 2, py: 1, borderRadius: 1 }}>B.Tech</Box>
              <Box sx={{ background: '#e3f2fd', color: '#1976d2', px: 2, py: 1, borderRadius: 1 }}>B.Sc</Box>
              <Box sx={{ background: '#e3f2fd', color: '#1976d2', px: 2, py: 1, borderRadius: 1 }}>BCA</Box>
            </Box>
            {/* Career Suggestions */}
            <Typography sx={{ color: '#ad1457', fontWeight: 600, mb: 1 }}>💼 Career Suggestions</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ background: '#fce4ec', color: '#ad1457', px: 2, py: 1, borderRadius: 1 }}>Engineer</Box>
              <Box sx={{ background: '#fce4ec', color: '#ad1457', px: 2, py: 1, borderRadius: 1 }}>Scientist</Box>
              <Box sx={{ background: '#fce4ec', color: '#ad1457', px: 2, py: 1, borderRadius: 1 }}>Software Developer</Box>
            </Box>
            {/* Next Steps */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography sx={{ color: '#388e3c', fontWeight: 600, mb: 2 }}>Next Steps</Typography>
              <Box>
                <a href="/colleges" style={{ margin: '0 1.2rem', color: '#1976d2', fontWeight: 600 }}>Explore Colleges</a>
                <a href="/career-mapping" style={{ margin: '0 1.2rem', color: '#1976d2', fontWeight: 600 }}>See Career Mapping</a>
                <a href="/scholarship" style={{ margin: '0 1.2rem', color: '#1976d2', fontWeight: 600 }}>Estimate Costs</a>
              </Box>
              <Button variant="contained" sx={{ mt: 3, background: '#b89b5e', color: '#fff', fontWeight: 600 }} onClick={() => window.location.reload()}>Retake Quiz</Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Quiz;
