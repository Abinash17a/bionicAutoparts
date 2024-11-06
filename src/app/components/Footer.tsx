import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#000000', color: '#EEEEEE', py: 6 }}>
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
            <Typography variant="h6" fontWeight="bold" color="#DC5F00" gutterBottom>
              Bionics Auto Parts
            </Typography>
            <Typography variant="body2" align="center">
              Providing quality auto parts since 2020. Your reliable partner for all automotive needs.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#CF0A0A">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ paddingLeft: '0', listStyleType: 'none' }}>
              {['Home', 'About Us', 'Contact', 'Products', 'FAQ'].map((item) => (
                <Box component="li" key={item} mb={1}>
                  <Link 
                    href={`/${item.toLowerCase().replace(' ', '-')}`} 
                    color="inherit" 
                    underline="hover"
                    sx={{ 
                      '&:hover': { 
                        color: '#DC5F00',
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
            <Typography variant="subtitle1" fontWeight="bold" mb={2} color="#CF0A0A">
              Contact Us
            </Typography>
            <Typography variant="body2" mb={1}>
              Email: <Link href="mailto:parts@bionicsautoparts.com" color="inherit" underline="hover">parts@bionicsautoparts.com</Link>
            </Typography>
            <Typography variant="body2" mb={1}>
              Phone: +1 617-390-7248
            </Typography>
            <Typography variant="body2" mb={1}>
              Address: 123 Auto Street, Car City, CC 12345
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} color="#DC5F00">
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
                      color: '#EEEEEE', 
                      '&:hover': { 
                        color: '#DC5F00',
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
        <Typography variant="body2" align="center" mt={6} sx={{ borderTop: '1px solid #333', paddingTop: 3 }}>
          &copy; {new Date().getFullYear()} Bionics Auto Parts. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}