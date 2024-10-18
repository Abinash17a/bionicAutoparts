"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1D4E89' }}> {/* Blue Ribbon color */}
        <Toolbar>
          {/* Logo Section */}
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo1.png" 
              alt="Bionics Auto Parts Logo" 
              style={{ height: '60px', marginRight: '10px' }} // Increased logo height
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              Bionics Auto Parts
            </Typography>
          </Link>

          {/* Space between logo and navigation links */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Links for Large Screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: '600' }}>Home</Button>
            </Link>
            <Link href="/about-us" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: '600' }}>About Us</Button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: '600' }}>Contact</Button>
            </Link>
          </Box>

          {/* Hamburger Icon for Mobile */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/about-us" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
