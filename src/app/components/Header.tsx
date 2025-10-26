"use client"

import * as React from "react"
import Image from "next/image"
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon, Phone as PhoneIcon } from "@mui/icons-material"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClickToRevealEmail } from "./ProtectedEmail"

export default function Header() {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about-us" },
    { title: "Contact", path: "/contact" },
    { title: "Blogs", path: "/blogs" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Top Info Bar */}
      <Box
        sx={{
          width: "100%",
          background: "#428eff",
          color: "#fff",
          fontSize: { xs: "0.85rem", md: "1rem" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 1.5, md: 6 },
          py: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 4, md: 8 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PhoneIcon sx={{ fontSize: 18, mr: 0.5 }} />
             +1 412 926 8644
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ClickToRevealEmail
              email="Parts@bionicsautoparts.com"
              label="Click to reveal email"
              className="inline-flex items-center text-white hover:text-cyan-300 hover:scale-105 transition-all duration-300 cursor-pointer"
            />
          </Box>
        </Box>
      </Box>
      {/* Main Header Bar */}
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "#fff",
          backgroundImage: "none",
          borderBottom: "1px solid #e0e0e0",
          fontFamily: "'Poppins', 'Inter', 'sans-serif'",
        }}
      >
        <Container maxWidth={false}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              py: { xs: 1, md: 1.5 },
              minHeight: { xs: 64, md: 70 },
              pl: { xs: 1, md: 3 },
            }}
          >
            {/* Logo Section */}
            <Link href="/" passHref style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  ml: -1,
                }}
              >
                <Image
                  src="/logo1.png"
                  alt="Bionics Autoparts Logo"
                  width={64}
                  height={64}
                  style={{ marginRight: 18, borderRadius: "50%", background: "#fff" }}
                  priority
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 800,
                    color: "#222",
                    fontFamily: "'Poppins', 'Inter', 'Cinzel', 'Matanya', serif",
                    letterSpacing: "2.5px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.06)",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    textDecoration: "none",
                  }}
                >
                  Bionics Autoparts
                </Typography>
              </Box>
            </Link>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
              {navItems.map((item) => (
                <Link key={item.title} href={item.path} passHref style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      color: isActive(item.path) ? "#ffb703" : "#333",
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      backgroundColor: "transparent",
                      transition: "color 0.2s ease",
                      fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                      "&:hover": {
                        color: "#ffb703",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                </Link>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#333",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              backgroundColor: "#fff",
              backgroundImage: "none",
              borderLeft: "1px solid #e0e0e0",
              fontFamily: "'Poppins', 'Inter', 'sans-serif'",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#222",
                  fontWeight: 800,
                  fontFamily: "'Poppins', 'Inter', 'Cinzel', 'Matanya', serif",
                  letterSpacing: "2.5px",
                  fontSize: "1.2rem",
                  textDecoration: "none",
                }}
              >
                Bionics Autoparts
              </Typography>
              <IconButton onClick={handleDrawerToggle} sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <List>
              {navItems.map((item) => (
                <ListItem key={item.title} disablePadding>
                  <Link href={item.path} passHref style={{ textDecoration: "none", width: "100%" }}>
                    <ListItemButton
                      onClick={handleDrawerToggle}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        backgroundColor: isActive(item.path) ? "rgba(255, 183, 3, 0.1)" : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                        fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: isActive(item.path) ? "#ffb703" : "#333",
                            fontWeight: 700,
                            fontSize: "1rem",
                            fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                            textDecoration: "none",
                          },
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </AppBar>
    </>
  )
}

