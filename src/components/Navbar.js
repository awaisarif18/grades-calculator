'use client';
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './ProfileMenu'; // adjust path if needed


export default function Navbar() {
  const { user, logout } = useAuth();

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Gradesum
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} href="/calculator">
            Calculator
          </Button>

        {!user ? (
          <>
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/auth/signup">
              Sign Up
            </Button>
          </>
        ) : (
          <ProfileMenu user={user} onLogout={logout} />
        )}

        </Box>
      </Toolbar>
    </AppBar>
  );
}
