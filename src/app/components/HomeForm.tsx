"use client"

import Image from "next/image"
import type React from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material"
import { Search, DirectionsCar, Build, CalendarToday, Category } from "@mui/icons-material"

interface HomeFormProps {
  year: string
  setYear: (value: string) => void
  make: string
  setMake: (value: string) => void
  model: string
  setModel: (value: string) => void
  part: string
  setPart: (value: string) => void
  handleSearch: () => void
  initialData: {
    years: string[]
    makes: string[]
    models: Record<string, string[]>
    parts: string[]
  }
}

export const HomeForm: React.FC<HomeFormProps> = ({
  year,
  setYear,
  make,
  setMake,
  model,
  setModel,
  part,
  setPart,
  handleSearch,
  initialData,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "100vh", md: "700px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#f8f9fa",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grid\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"%23e9ecef\" stroke-width=\"0.5\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grid)\"/></svg>')",
          opacity: 0.5,
          zIndex: 1,
        },
      }}
    >
      {/* Form Container */}
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={8}
          sx={{
            position: "relative",
            zIndex: 2,
            px: 3,
            width: "100%",
            maxWidth: "md",
            ml: "auto",
            p: { xs: 5, md: 7 },
            borderRadius: 20,
            background: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            backdropFilter: "blur(10px)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "5px",
              background: "#3b82f6",
              borderRadius: "5px 5px 0 0",
            },
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={7}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#212529",
                mb: 2,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Find Your Auto Parts
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                fontSize: "1.1rem",
                color: "#6c757d",
                lineHeight: 1.6,
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              Search our extensive inventory of quality used auto parts with confidence
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" noValidate>
            <Grid container spacing={2} direction="column">
              {/* Year Field */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: "#6c757d", fontSize: "1rem" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      minHeight: "40px",
                      fontSize: "0.98rem",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                      fontWeight: 600,
                      fontSize: "0.98rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#495057",
                      fontSize: "0.98rem",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "0.98rem",
                      fontWeight: 500,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <MenuItem value="">
                    <em>Select Year</em>
                  </MenuItem>
                  {initialData.years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Make Field */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <DirectionsCar sx={{ mr: 1.5, color: "#6c757d", fontSize: "1.2rem" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      minHeight: "56px",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                      fontWeight: 600,
                      fontSize: "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#495057",
                      fontSize: "1rem",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <MenuItem value="">
                    <em>Select Make</em>
                  </MenuItem>
                  {initialData.makes.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Model Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  variant="outlined"
                  disabled={!make}
                  InputProps={{
                    startAdornment: <Category sx={{ mr: 1.5, color: make ? "#6c757d" : "#adb5bd", fontSize: "1.2rem" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: make ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)",
                      minHeight: "56px",
                      "&:hover": {
                        backgroundColor: make ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)",
                        transform: make ? "translateY(-1px)" : "none",
                        boxShadow: make ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
                      },
                      "&:hover fieldset": {
                        borderColor: make ? "#3b82f6" : "#dee2e6",
                        borderWidth: make ? "2px" : "1px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: make ? "#3b82f6" : "#dee2e6",
                        borderWidth: make ? "2px" : "1px",
                      },
                      "&.Mui-focused": {
                        backgroundColor: make ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)",
                        transform: make ? "translateY(-1px)" : "none",
                        boxShadow: make ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: make ? "#3b82f6" : "#adb5bd",
                      fontWeight: make ? 600 : 500,
                      fontSize: "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: make ? "#495057" : "#adb5bd",
                      fontSize: "1rem",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <MenuItem value="">
                    <em>Select Model</em>
                  </MenuItem>
                  {make &&
                    initialData.models[make]?.map((mod) => (
                      <MenuItem key={mod} value={mod}>
                        {mod}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>

              {/* Part Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Part"
                  value={part}
                  onChange={(e) => setPart(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Build sx={{ mr: 1.5, color: "#6c757d", fontSize: "1.2rem" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      minHeight: "56px",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#3b82f6",
                      fontWeight: 600,
                      fontSize: "1rem",
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 500,
                      color: "#495057",
                      fontSize: "1rem",
                    },
                    "& .MuiSelect-select": {
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <MenuItem value="">
                    <em>Select Part</em>
                  </MenuItem>
                  {initialData.parts.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Search Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<Search sx={{ fontSize: "1.3rem" }} />}
                  sx={{
                    py: 3,
                    mt: 4,
                    borderRadius: 2,
                    background: "#3b82f6",
                    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    textTransform: "none",
                    letterSpacing: "0.5px",
                    minHeight: "64px",
                    "&:hover": {
                      background: "#2563eb",
                      boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Search Parts
                </Button>
              </Grid>
            </Grid>

            {/* Additional Info */}
            <Box mt={7} textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: "1rem",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  "& .highlight": {
                    color: "#3b82f6",
                    fontWeight: 600,
                  },
                }}
              >
                <span className="highlight">✓</span> Quality tested parts • <span className="highlight">✓</span> Fast shipping • <span className="highlight">✓</span> 30-day warranty
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  )
}

