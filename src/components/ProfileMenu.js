'use client';
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('');
  const [uni, setUni] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords don't match!");

    try {
      const newUser = await signup(email, password, username);
      const uid = newUser.user.uid;
      const userEmail = newUser.user.email;

      await setDoc(doc(db, 'profiles', uid), {
        userId: uid,
        email: userEmail,
        fullName,
        degree,
        university: uni,
      });

      router.push('/calculator');
    } catch (err) {
      setError(err.message || "Signup failed");
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

          <form onSubmit={handleSignup}>
            {[
              { label: 'Username', value: username, setValue: setUsername, type: 'text' },
              { label: 'Email', value: email, setValue: setEmail, type: 'email' },
              { label: 'Password', value: password, setValue: setPassword, type: 'password' },
              { label: 'Confirm Password', value: confirm, setValue: setConfirm, type: 'password' },
              { label: 'Full Name', value: fullName, setValue: setFullName, type: 'text' },
              { label: 'Degree Program', value: degree, setValue: setDegree, type: 'text' },
              { label: 'University', value: uni, setValue: setUni, type: 'text' },
            ].map(({ label, value, setValue, type }, index) => (
              <TextField
                key={index}
                label={label}
                value={value}
                type={type}
                required
                fullWidth
                onChange={(e) => setValue(e.target.value)}
                margin="normal"
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#fff' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&:hover fieldset': { borderColor: '#fff' },
                    '&.Mui-focused fieldset': { borderColor: '#fff' },
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
