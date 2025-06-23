// FeedbackForm.js
'use client';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'feedback'), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to send feedback. Try again later.');
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mt: 6,
        maxWidth: 600,
        mx: 'auto',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Typography variant="h5" gutterBottom color="white">
        💬 Feedback Form
      </Typography>

      {success && (
        <Typography color="success.main" mb={2}>
          Thank you for your feedback!
        </Typography>
      )}

      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          type="email"
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={4}
          inputProps={{ maxLength: 250 }}
          helperText={`${message.length}/250`}
          InputLabelProps={{ style: { color: '#fff' } }}
          InputProps={{ style: { color: '#fff' } }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ alignSelf: 'flex-start' }}
        >
          Submit Feedback
        </Button>
      </Stack>
    </Paper>
  );
}
