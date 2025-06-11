"use client";
import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";

export default function ProfileMenu({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar sx={{ bgcolor: "#673ab7" }}>
          {(user.displayName || user.email)?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: "#673ab7",
              width: 56,
              height: 56,
              margin: "0 auto",
              mb: 1,
            }}
          >
            {(user.displayName || user.email)?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1">
            {user.displayName || "No Name"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
