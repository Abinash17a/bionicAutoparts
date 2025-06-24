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
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
    <AppBar
      position="static"
      elevation={4}
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
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {navItems.map((item) => (
              <Link key={item.title} href={item.path} passHref style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    color: isActive(item.path) ? "#ffb703" : "#222",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    textTransform: "none",
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 2,
                    position: "relative",
                    backgroundColor: isActive(item.path) ? "rgba(255, 183, 3, 0.08)" : "transparent",
                    transition: "all 0.3s ease",
                    fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                    letterSpacing: "0.7px",
                    textDecoration: "none",
                    boxShadow: "none",
                    "&:hover": {
                      color: "#fb8500",
                      backgroundColor: "rgba(251, 133, 0, 0.08)",
                      transform: "translateY(-2px)",
                      textDecoration: "none",
                    },
                    "&::after": isActive(item.path)
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "80%",
                          height: "2px",
                          backgroundColor: "#ffb703",
                          borderRadius: "1px",
                        }
                      : {},
                  }}
                >
                  <span style={{ textDecoration: "none", fontWeight: 700, fontFamily: "'Poppins', 'Inter', 'sans-serif'", letterSpacing: "0.7px" }}>{item.title}</span>
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
              color: "#ffb703",
              backgroundColor: "rgba(255, 183, 3, 0.08)",
              "&:hover": {
                backgroundColor: "rgba(255, 183, 3, 0.16)",
                transform: "rotate(90deg)",
              },
              transition: "all 0.3s ease",
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
          keepMounted: true, // Better open performance on mobile
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
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#ffb703" }}>
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
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: isActive(item.path) ? "rgba(255, 183, 3, 0.08)" : "transparent",
                      border: isActive(item.path) ? "1px solid rgba(255, 183, 3, 0.18)" : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: "rgba(251, 133, 0, 0.08)",
                        transform: "translateX(8px)",
                      },
                      transition: "all 0.3s ease",
                      fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: isActive(item.path) ? "#ffb703" : "#222",
                          fontWeight: isActive(item.path) ? 700 : 600,
                          fontSize: "1.08rem",
                          fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                          letterSpacing: "0.7px",
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
  )
}

