"use client";
import * as React from 'react';
import { usePathname } from 'next/navigation'; // Correct hook for Next.js App Router
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
  const pathname = usePathname(); // Get the current path
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to apply styles based on the active route (removing underline)
  const linkStyle = (path: string) => ({
    textDecoration: 'none', // No underline
    color: pathname === path ? '#FFDD00' : '#FFFFFF', // Yellow if active, white otherwise
    fontWeight: pathname === path ? 'bold' : 'normal', // Bold if active
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#1D4E89', zIndex: 1100 }}>
        <Toolbar>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/logo1.png" 
              alt="Bionics Auto Parts Logo" 
              style={{ height: '60px', marginRight: '10px' }} 
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              Bionics Auto Parts
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Links for Large Screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Link href="/" style={linkStyle('/')}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: '600' }}>Home</Button>
            </Link>
            <Link href="/about-us" style={linkStyle('/about-us')}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: '600' }}>About Us</Button>
            </Link>
            <Link href="/contact" style={linkStyle('/contact')}>
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
              <Link href="/" style={{color:'#000000'}}>Home</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/about-us" style={{color:'#000000'}}>About Us</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/contact" style={{color:'#000000'}}>Contact</Link>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
