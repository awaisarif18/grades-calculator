"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [loading, user]);

  if (loading) return null;

  return (
    <Box textAlign="center" py={8} px={2}>
      <Typography variant="h2" gutterBottom>
        Welcome to Gradesum
      </Typography>

      {user ? (
        <>
          <Typography variant="h6" mb={2}>
            Hello, {user.displayName || user.email} 👋
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={4}>
            Track your semesters CGPA, save your GPA history, and plan for your target CGPA.
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={4}>
            Click the button below to start. 👇
          </Typography>

        </>
      ) : (
        <Typography variant="h6" color="textSecondary" mb={4}>
          Track your semesters, save your GPA history, and plan for your target CGPA.
        </Typography>
      )}

      <Button
        component={Link}
        href="/calculator"
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
      >
        Calculate Your CGPA Now
      </Button>

      {/* LOGIN/SIGNUP MODAL */}
      <Modal
  open={showModal}
  onClose={() => setShowModal(false)}
  aria-labelledby="login-modal-title"
  aria-describedby="login-modal-description"
>
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    px={2}
  >
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        width: isMobile ? "100%" : 400,
        textAlign: "center",
        position: "relative", // for absolute close button
      }}
    >
      {/* ❌ Close Button */}
      <Button
        onClick={() => setShowModal(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          minWidth: "unset",
          padding: "4px 8px",
          fontSize: "1.2rem",
          color: "gray",
          lineHeight: 1,
        }}
      >
        &times;
      </Button>

      <Typography variant="h6" id="login-modal-title" gutterBottom>
        You're not logged in!
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        Please log in or sign up to save your CGPA history and progress.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          component={Link}
          href="/auth/login"
          fullWidth
        >
          Login
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href="/auth/signup"
          fullWidth
        >
          Signup
        </Button>
      </Stack>
    </Paper>
  </Box>
</Modal>

    </Box>
  );
}
