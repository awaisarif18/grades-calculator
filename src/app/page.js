"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h2" gutterBottom>
        Welcome to Gradesum
      </Typography>
      <Typography variant="h6" color="textSecondary" mb={4}>
        Track your semesters, save your GPA history, and plan for your target
        CGPA.
      </Typography>
      <Button
        component={Link}
        href="/calculator"
        variant="contained"
        size="large"
      >
        Calculate Your CGPA Now
      </Button>
    </Box>
  );
}
