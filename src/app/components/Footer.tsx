import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#023047', color: '#8ecae6', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Left side with logo and description */}
          <Grid item xs={12} md={4} container alignItems="center" direction="column">
            <Image
              src="/visa.png"
              alt="Visa"
              width={150}
              height={150}
              style={{ marginBottom: '16px' }}
            />
            <Typography variant="h6" fontWeight="bold" color="#ffb703" gutterBottom>
              Bionics Auto Parts
            </Typography>
            <Typography variant="body2" align="center" color="#8ecae6">
              Providing quality auto parts since 2020. Your reliable partner for all automotive needs.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#ffb703">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ paddingLeft: '0', listStyleType: 'none' }}>
              {['About Us', 'Contact',].map((item) => (
                <Box component="li" key={item} mb={1}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    color="inherit" 
                    underline="hover"
                    sx={{ 
                      '&:hover': { 
                        color: '#fb8500',
                        transition: 'color 0.3s ease'
                      }
                    }}
                  >
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Us */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#ffb703">
              Contact Us
            </Typography>
            <Typography variant="body2" mb={1} color="#8ecae6">
              Email: <Link href="mailto:parts@bionicsautoparts.com" color="inherit" underline="hover" sx={{ '&:hover': { color: '#fb8500' } }}>parts@bionicsautoparts.com</Link>
            </Typography>
            <Typography variant="body2" mb={1} color="#8ecae6">
              Phone: +1 617-390-7248
            </Typography>
            <Typography variant="body2" mb={1} color="#8ecae6">
            6332 Deep Canyon Dr,Beverly Hills,CA 90210
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} color="#ffb703">
                Follow Us
              </Typography>
              <Box>
                {[
                  { icon: FaFacebook, url: 'https://facebook.com' },
                  { icon: FaTwitter, url: 'https://twitter.com' },
                  { icon: FaInstagram, url: 'https://instagram.com' },
                  { icon: FaLinkedin, url: 'https://linkedin.com' }
                ].map((social, index) => (
                  <IconButton 
                    key={index}
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: '#8ecae6', 
                      '&:hover': { 
                        color: '#fb8500',
                        transform: 'translateY(-3px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <social.icon size={20} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Footer copyright */}
        <Typography variant="body2" align="center" mt={6} sx={{ borderTop: '1px solid #219ebc', paddingTop: 3 }}>
          &copy; {new Date().getFullYear()} Bionics Auto Parts. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
