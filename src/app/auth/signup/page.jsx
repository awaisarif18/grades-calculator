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

  const handle = async (e) => {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #fc5c7d, #6a82fb)',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: 4,
            width: '500px',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Typography variant="h4" align="center" mb={2}>
            Sign Up
          </Typography>
          <form onSubmit={handle}>
            {[
              { label: 'Username', type: 'text', value: username, setValue: setUsername },
              { label: 'Email', type: 'email', value: email, setValue: setEmail },
              { label: 'Password', type: 'password', value: password, setValue: setPassword },
              { label: 'Confirm Password', type: 'password', value: confirm, setValue: setConfirm },
            ].map(({ label, type, value, setValue }, idx) => (
              <TextField
                key={idx}
                label={label}
                type={type}
                required
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                margin="normal"
                InputProps={{
                  style: { color: '#fff' },
                }}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                  },
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
            ))}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
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
              Create Account
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
}
