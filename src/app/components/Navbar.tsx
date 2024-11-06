"use client";

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
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about-us' },
    { title: 'Contact', path: '/contact' },
  ];

  const linkStyle = (path: string) => ({
    color: pathname === path ? '#DC5F00' : '#EEEEEE',
    fontWeight: pathname === path ? 'bold' : 'normal',
    position: 'relative',
    textDecoration: 'none',
    padding: '6px 0',
    margin: '0 16px',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#DC5F00',
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease',
    },
    '&::before': {
      top: 0,
    },
    '&::after': {
      bottom: 0,
    },
    '&:hover::before, &:hover::after': {
      transform: 'scaleX(1)',
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#CF0A0A', zIndex: 1100 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h4" component="div" sx={{ 
            fontWeight: 'bold', 
            color: '#EEEEEE',
            textAlign: 'center',
            padding: '12px 0',
          }}>
            Bionics Autoparts
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: '#000000', zIndex: 1100 }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          {/* Links for Large Screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', width: '100%' }}>
            {navItems.map((link) => (
              <Link key={link.title} href={link.path} passHref>
                <Button 
                  color="inherit" 
                  sx={{ 
                    ...linkStyle(link.path),
                    fontSize: '1rem', 
                    fontWeight: '600',
                  }}
                >
                  {link.title}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Hamburger Icon for Mobile */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              position: 'absolute',
              right: 16,
              color: '#EEEEEE',
              '&:hover': {
                backgroundColor: 'rgba(220, 95, 0, 0.1)',
              },
            }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: '#000000',
                color: '#EEEEEE',
              }
            }}
          >
            {navItems.map((link) => (
              <MenuItem 
                key={link.title} 
                onClick={handleClose}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(220, 95, 0, 0.1)',
                  },
                }}
              >
                <Link href={link.path} passHref style={linkStyle(link.path)}>
                  {link.title}
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}