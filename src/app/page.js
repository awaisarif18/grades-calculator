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
import { motion } from "framer-motion";
import FeedbackForm from "@/components/FeedBackForm";

export default function HomePage() {
  const { user, loading } = useAuth();
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
    <div>
    <Box
      sx={{
        minHeight: "130vh",
        background: "linear-gradient(to right, #1d2b64, #f8cdda)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "700px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Gradesum
        </Typography>

        {user ? (
          <>
            <Typography variant="h6" mb={2}>
              Hello, {user.displayName || user.email} 👋
            </Typography>
            <Typography variant="h6" mb={4}>
              Track your semesters CGPA, save your GPA history, and plan for your target CGPA.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component={Link}
                href="/history"
                variant="outlined"
                size="large"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  '&:hover': {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "#fff",
                  },
                }}
              >
                View History
              </Button>
            </Stack>
          </>
        ) : (
          <Typography variant="h6" mb={4}>
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
      </motion.div>

      {/* Modal if not logged in */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" px={2}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: isMobile ? "100%" : 400, position: "relative" }}>
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
              }}
            >
              &times;
            </Button>

            <Typography variant="h6" gutterBottom>
              You're not logged in!
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Please log in or sign up to save your CGPA history and progress.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" component={Link} href="/auth/login" fullWidth>
                Login
              </Button>
              <Button variant="outlined" component={Link} href="/auth/signup" fullWidth>
                Signup
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Modal>

      <Box mt={6} width="100%" maxWidth="700px">
        <FeedbackForm />
      </Box>
    </Box>
    </div>
  );
}
