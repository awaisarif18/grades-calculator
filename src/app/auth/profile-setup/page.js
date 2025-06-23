// pages/profile-setup.js
'use client';
import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "users", user.uid), {
        department,
        phone
      });
      router.push('/calculator');
    } catch (err) {
      setError("Failed to save profile info");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" mb={2}>Complete Your Profile</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Department" value={department}
            onChange={(e) => setDepartment(e.target.value)} margin="normal"
          />
          <TextField
            fullWidth label="Phone Number" value={phone}
            onChange={(e) => setPhone(e.target.value)} margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>Save</Button>
        </form>
      </Paper>
    </Box>
  );
}
