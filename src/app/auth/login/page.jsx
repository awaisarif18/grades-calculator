'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handle = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/calculator');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'linear-gradient(to right, #1d2b64, #f8cdda)', p:2 }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration:0.5 }}>
        <Paper sx={{ p:4, borderRadius:3 }}>
          <Typography variant="h4" align="center" mb={2}>Log In</Typography>
          <form onSubmit={handle}>
            <TextField label="Email" type="email" required fullWidth value={email} onChange={e=>setEmail(e.target.value)} />
            <TextField label="Password" type="password" required fullWidth value={password} onChange={e=>setPassword(e.target.value)} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Sign In</Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
