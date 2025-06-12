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

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/calculator');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #1d2b64, #f8cdda)',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            width: 450,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Typography variant="h4" align="center" mb={3}>
            Log In
          </Typography>

          <form onSubmit={handle}>
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: { color: '#fff' },
              }}
              InputLabelProps={{
                style: { color: '#fff' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: '#fff' },
              }}
              InputLabelProps={{
                style: { color: '#fff' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
              }}
            />

            {error && (
              <Typography color="error" mt={1} mb={1}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#fff',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                transition: '0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.4)',
                  color: '#1d2b64',
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
