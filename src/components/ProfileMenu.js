"use client";
import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProfileMenu({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
        <Avatar>{user.name?.charAt(0).toUpperCase()}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
      >
        <MenuItem>
          <Typography variant="body1">{user.name}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onLogout();
            handleClose();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
