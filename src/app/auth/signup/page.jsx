'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handle = async e => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords don't match!");
    try {
      await signup(email, password, username);
      router.push('/calculator');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to right, #fc5c7d, #6a82fb)', p: 2 }}>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration:0.5 }}>
        <Paper sx={{ p:4, borderRadius:3 }}>
          <Typography variant="h4" align="center" mb={2}>Sign Up</Typography>
          <form onSubmit={handle}>
            <TextField label="Username" required fullWidth value={username} onChange={e=>setUsername(e.target.value)} />
            <TextField label="Email" type="email" required fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
            <TextField label="Password" type="password" required fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
            <TextField label="Confirm Password" type="password" required fullWidth value={confirm} onChange={e=>setConfirm(e.target.value)} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Create Account</Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
