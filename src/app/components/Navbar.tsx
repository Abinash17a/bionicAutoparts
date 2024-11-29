'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@fontsource/bebas-neue';

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
    { title: 'Blogs', path: '/blogs' },
  ];

  const linkStyle = (path: string) => ({
    color: pathname === path ? '#ffb703' : '#8ecae6',
    fontWeight: pathname === path ? 'bold' : 'normal',
    position: 'relative',
    textDecoration: 'none',
    padding: '6px 0',
    margin: '0 16px',
    '&:hover': {
      color: '#fb8500',
    },
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#023047' }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" passHref>
              <Typography
                variant="h5"
                component="a"
                sx={{
                  fontWeight: 'bold',
                  color: '#ffb703',
                  display: { xs: 'block', md: 'block' },
                  mr: 2,
                  cursor: 'pointer',
                  fontFamily: 'Matanya, sans-serif', // Use Matanya font
                  letterSpacing: '1px', // Optional for added style
                }}
              >
                Bionics Autoparts
              </Typography>
            </Link>
            <img
              src="/bbb_trust_logo.png" // Replace with your logo image path
              alt="BBB Trust Logo"
              style={{ height: '40px', objectFit: 'contain' }}
            />
          </Box>

          {/* Links for Large Screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navItems.map((link) => (
              <Link key={link.title} href={link.path} passHref>
                <Button color="inherit" sx={{ ...linkStyle(link.path), fontSize: '1rem', fontWeight: '600' }}>
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
              color: '#ffb703',
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
                backgroundColor: '#023047',
                color: '#8ecae6',
              },
            }}
          >
            {navItems.map((link) => (
              <MenuItem
                key={link.title}
                onClick={handleClose}
                sx={{
                  '&:hover': {
                    backgroundColor: '#fb8500',
                    color: '#023047',
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

