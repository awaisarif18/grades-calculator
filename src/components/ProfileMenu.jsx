"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfileMenu({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [profileData, setProfileData] = useState({});

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const photoRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(photoRef, file);
      const url = await getDownloadURL(photoRef);
      setPhotoURL(url);

      // Save to Firestore as well
      await setDoc(
        doc(db, "profiles", user.uid),
        { profilePicture: url },
        { merge: true }
      );
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhotoURL(data.profilePicture || null);
          setProfileData(data);
        }
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar sx={{ bgcolor: "#673ab7" }} src={photoURL || undefined}>
          {!photoURL && (user.displayName || user.email)?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
          <label htmlFor="profile-upload">
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
            <Avatar
              sx={{
                bgcolor: "#673ab7",
                width: 70,
                height: 70,
                margin: "0 auto",
                mb: 1,
                cursor: "pointer",
              }}
              src={photoURL || undefined}
            >
              {!photoURL && (user.displayName || user.email)?.charAt(0).toUpperCase()}
            </Avatar>
          </label>

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {profileData?.fullName || user.displayName || "No Name"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>

          {profileData?.university && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              🎓 {profileData.university}
            </Typography>
          )}

          {profileData?.degree && (
            <Typography variant="body2">📘 {profileData.degree}</Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Box>
      </Menu>
    </>
  );
}
