"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

export default function ProfileMenu({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      }
    };
    fetchProfile();
  }, [user]);

  const firstLetter = (user?.displayName || user?.email)?.charAt(0)?.toUpperCase();

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "profiles", user.uid), { photoURL: url });
    setProfileData((prev) => ({ ...prev, photoURL: url }));
    setUploading(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar
          src={profileData?.photoURL || ""}
          sx={{ bgcolor: "#673ab7" }}
        >
          {!profileData.photoURL && firstLetter}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            color: "#fff",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{ px: 2, py: 2, textAlign: "center", width: 250 }}
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Avatar
            src={profileData?.photoURL || ""}
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              width: 70,
              height: 70,
              margin: "0 auto",
              mb: 1,
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {!profileData.photoURL && firstLetter}
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />

          {uploading && (
            <Typography variant="caption" color="#ddd" sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1 }}>
              Uploading...
              <CircularProgress size={14} sx={{ ml: 1, color: "#fff" }} />
            </Typography>
          )}

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {user?.displayName || profileData?.fullName || "No Name"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#f0f0f0" }}>
            {user?.email}
          </Typography>

          {profileData.university && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              🎓 {profileData.university}
            </Typography>
          )}

          {profileData.degree && (
            <Typography variant="body2">
              📘 {profileData.degree}
            </Typography>
          )}

          <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }} />

          <MenuItem onClick={handleLogout} sx={{ color: "#fff", justifyContent: "center" }}>
            Logout
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}
