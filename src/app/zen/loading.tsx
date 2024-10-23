"use client";
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8', // Light background for a better visual experience
      }}
    >
      <CircularProgress
        size={60} // Increase size for better visibility
        sx={{ color: '#1D4E89', mb: 2 }} // Custom color that matches your theme
      />
      <Typography variant="h6" sx={{ color: '#333' }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default Loading;
