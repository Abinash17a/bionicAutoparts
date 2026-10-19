"use client"

import * as React from "react"
import Image from "next/image"
import {
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { title: "Home", path: "/" },
  { title: "Used Engines", path: "/used-engines" },
  { title: "Transmissions", path: "/used-transmissions" },
  { title: "All Parts", path: "/parts" },
  { title: "About", path: "/about-us" },
  { title: "Contact", path: "/contact" },
  { title: "Blogs", path: "/blogs" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isHome = pathname === "/"

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Floating Navigation Card Sitting Directly Over Hero/Page */}
      <Box
        component="nav"
        aria-label="Main Navigation"
        sx={{
          position: "fixed",
          top: { xs: "12px", md: "18px" },
          left: 0,
          right: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1100,
          pointerEvents: "none",
          px: { xs: 1.5, sm: 2.5, md: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: "94%", sm: "92%", md: "90%" },
            maxWidth: "1450px",
            height: { xs: "80px", md: "105px" },
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 2.5, md: 3.5, lg: 4 },
            backgroundColor: "#ffffff",
            borderRadius: { xs: "16px", md: "20px" },
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.08)",
            fontFamily: "'Poppins', 'Inter', 'sans-serif'",
          }}
        >
          {/* Logo + Brand */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  opacity: 0.92,
                  transform: "scale(1.02)",
                },
              }}
            >
              <Image
                src="/logo and landing/usedautopartslogo.png"
                alt="USA Used Auto Parts"
                width={380}
                height={120}
                sizes="(max-width: 768px) 200px, 280px"
                className="h-[64px] md:h-[90px] w-auto object-contain"
                priority
              />
            </Box>
          </Link>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 0.5, lg: 1.25 },
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path)
              return (
                <Button
                  key={item.title}
                  component={Link}
                  href={item.path}
                  prefetch={true}
                  sx={{
                    color: active ? "#2563eb" : "#1f2937",
                    fontWeight: active ? 700 : 500,
                    fontSize: { md: "0.85rem", lg: "0.925rem" },
                    textTransform: "none",
                    px: { md: 1.25, lg: 1.75 },
                    py: 0.8,
                    borderRadius: "10px",
                    backgroundColor: active ? "rgba(37, 99, 235, 0.08)" : "transparent",
                    transition: "all 0.2s ease",
                    fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                    "&:hover": {
                      color: "#2563eb",
                      backgroundColor: active
                        ? "rgba(37, 99, 235, 0.12)"
                        : "rgba(37, 99, 235, 0.05)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              )
            })}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#1f2937",
              p: 1,
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "rgba(37, 99, 235, 0.06)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Spacer for non-home pages so fixed navbar doesn't obscure top content */}
      {!isHome && (
        <Box
          sx={{
            height: { xs: "95px", md: "125px" },
            width: "100%",
            visibility: "hidden",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      )}

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
            width: 290,
            backgroundColor: "#fff",
            backgroundImage: "none",
            borderLeft: "1px solid #e0e0e0",
            fontFamily: "'Poppins', 'Inter', 'sans-serif'",
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Link
              href="/"
              onClick={handleDrawerToggle}
              style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
            >
              <Image
                src="/logo and landing/usedautopartslogo.png"
                alt="USA Used Auto Parts"
                width={260}
                height={85}
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#1f2937" }} aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ pt: 1 }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path)
              return (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.path}
                    prefetch={true}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: "10px",
                      mb: 0.75,
                      backgroundColor: active ? "rgba(37, 99, 235, 0.08)" : "transparent",
                      "&:hover": {
                        backgroundColor: active
                          ? "rgba(37, 99, 235, 0.12)"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: active ? "#2563eb" : "#1f2937",
                          fontWeight: active ? 700 : 500,
                          fontSize: "0.95rem",
                          fontFamily: "'Poppins', 'Inter', 'sans-serif'",
                          textDecoration: "none",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Drawer>
    </>
  )
}


