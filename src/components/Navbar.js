"use client";
import React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "../hooks/useAuth";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Gradesum
        </Typography>

        <Button color="inherit" component={Link} href="/calculator">
          Calculator
        </Button>

        {user ? (
          <ProfileMenu user={user} onLogout={logout} />
        ) : (
          <>
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/auth/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
