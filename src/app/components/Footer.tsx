import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import icons for social media
import Image from 'next/image'; 
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#1D4E89', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          {/* Left side with logo and description */}
          <Grid item xs={12} md={6} container alignItems="center">
            <Image
              src="/visa.png" 
              alt="Visa"
              width={200} 
              height={200} 
              style={{ marginRight: '16px' }} // Adjust margin
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">Bionic Auto Parts</Typography>
              <Typography variant="body2">
                Providing quality auto parts since 2020. Your reliable partner for all automotive needs.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links and Contact Us */}
          <Grid item xs={12} md={6} container spacing={3}>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Quick Links</Typography>
              <ul style={{ paddingLeft: '0', listStyleType: 'none' }}>
                <li>
                  <Link href="/" color="inherit" underline="hover">Home</Link>
                </li>
                <li>
                  <Link href="/about-us" color="inherit" underline="hover">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" color="inherit" underline="hover">Contact</Link>
                </li>
              </ul>
            </Grid>
            <Grid item xs={6} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Contact Us</Typography>
              <Typography variant="body2">Email: parts@bionicsautoparts.com</Typography>
              <Typography variant="body2">Phone: +1 617-390-7248</Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box display="flex" justifyContent="center" mt={4}>
          <IconButton href="https://facebook.com" color="inherit" sx={{ mx: 1 }}>
            <FaFacebook size={24} />
          </IconButton>
          <IconButton href="https://twitter.com" color="inherit" sx={{ mx: 1 }}>
            <FaTwitter size={24} />
          </IconButton>
          <IconButton href="https://instagram.com" color="inherit" sx={{ mx: 1 }}>
            <FaInstagram size={24} />
          </IconButton>
          <IconButton href="https://linkedin.com" color="inherit" sx={{ mx: 1 }}>
            <FaLinkedin size={24} />
          </IconButton>
        </Box>

        {/* Footer copyright */}
        <Typography variant="body2" align="center" mt={4}>
          &copy; 2020 Bionics Auto Parts. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
