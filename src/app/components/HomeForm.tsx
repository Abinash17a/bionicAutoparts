"use client"

import React, { ReactNode } from "react"
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Chip,
  Divider,
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

// Car make logos mapping
const makeLogos: Record<string, string> = {
  AMC: "/car-logos/amc.png",
  Acura: "/car-logos/acura.png",
  ALFA: "/car-logos/alfa-romeo.png",
  Aston_Martin: "/car-logos/aston-martin.png",
  Audi: "/car-logos/audi.png",
  Austin: "/car-logos/austin.png",
  AutoCar: "/car-logos/autocar.png",
  Avanti: "/car-logos/avanti.png",
  BMW: "/car-logos/bmw.png",
  Bentley: "/car-logos/bentley.png",
  Buick: "/car-logos/buick.png",
  Cadillac: "/car-logos/cadillac.png",
  Chevy: "/car-logos/chevrolet.png",
  Chrysler: "/car-logos/chrysler.png",
  Citroen: "/car-logos/citroen.png",
  Daewoo: "/car-logos/daewoo.png",
  Daihatsu: "/car-logos/daihatsu.png",
  Delorean: "/car-logos/delorean.png",
  Dodge: "/car-logos/dodge.png",
  Eagle: "/car-logos/eagle.png",
  Ferrari: "/car-logos/ferrari.png",
  Fiat: "/car-logos/fiat.png",
  Fisker: "/car-logos/fisker.png",
  Ford: "/car-logos/ford.png",
  Genesis: "/car-logos/genesis.png",
  GMC: "/car-logos/gmc.png",
  Honda: "/car-logos/honda.png",
  Hudson: "/car-logos/hudson.png",
  Hummer: "/car-logos/hummer.png",
  Hyundai: "/car-logos/hyundai.png",
  Infiniti: "/car-logos/infiniti.png",
  Isuzu: "/car-logos/isuzu.png",
  Jaguar: "/car-logos/jaguar.png",
  Jeep: "/car-logos/jeep.png",
  Kia: "/car-logos/kia.png",
  Lamborghini: "/car-logos/lamborghini.png",
  LandRover: "/car-logos/land-rover.png",
  Lexus: "/car-logos/lexus.png",
  Lincoln: "/car-logos/lincoln.png",
  Lotus: "/car-logos/lotus.png",
  MG: "/car-logos/mg.png",
  Maserati: "/car-logos/maserati.png",
  Maybach: "/car-logos/maybach.png",
  Mazda: "/car-logos/mazda.png",
  McLaren: "/car-logos/mclaren.png",
  MercedesBenz: "/car-logos/mercedes-benz.png",
  Mercury: "/car-logos/mercury.png",
  Mini: "/car-logos/mini.png",
  Mitsubishi: "/car-logos/mitsubishi.png",
  Nissan: "/car-logos/nissan.png",
  Oldsmobile: "/car-logos/oldsmobile.png",
  Plymouth: "/car-logos/plymouth.png",
  Polestar: "/car-logos/polestar.png",
  Pontiac: "/car-logos/pontiac.png",
  Porsche: "/car-logos/porsche.png",
  Ram: "/car-logos/ram.png",
  Renault: "/car-logos/renault.png",
  RollsRoyce: "/car-logos/rolls-royce.png",
  Rover: "/car-logos/rover.png",
  Saab: "/car-logos/saab.png",
  Saturn: "/car-logos/saturn.png",
  Subaru: "/car-logos/subaru.png",
  Suzuki: "/car-logos/suzuki.png",
  Tesla: "/car-logos/tesla.png",
  Toyota: "/car-logos/toyota.png",
  Triumph: "/car-logos/triumph.png",
  Volkswagen: "/car-logos/volkswagen.png",
  Volvo: "/car-logos/volvo.png",
  Western: "/car-logos/western-star.png",
  Willys: "/car-logos/jeep.png", // Using Jeep as fallback (Willys was acquired by Jeep)
  Winnebago: "/car-logos/winnebago.png",
  Yugo: "/car-logos/yugo.png",
};

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

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        minHeight: "auto",
        maxWidth: { xs: "95vw", sm: "400px" },
        mx: "auto",
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
        backdropFilter: "blur(10px)",
        borderRadius: { xs: 3, sm: 4 },
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: {
          xs: "0 4px 20px rgba(0, 0, 0, 0.25)",
          sm: "0 8px 32px rgba(0, 0, 0, 0.3)"
        },
      }}
    >
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 1.5, sm: 2 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            color="#ffffff"
            mb={0.5}
            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Find Auto Parts
          </Typography>
          <Typography
            variant="body2"
            color="#e2e8f0"
            mb={1}
            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
          >
            Search our inventory step by step
          </Typography>
        </Box>

        {/* Progress Steps */}
        <Stack
          direction="row"
          spacing={{ xs: 0.5, sm: 1 }}
          mb={{ xs: 1.5, sm: 2 }}
          justifyContent="center"
        >
          {[
            { label: "Year", completed: !!year },
            { label: "Make", completed: !!make },
            { label: "Model", completed: !!model },
            { label: "Part", completed: !!part }
          ].map((step, index) => (
            <Chip
              key={index}
              label={step.label}
              size="small"
              variant={step.completed ? "filled" : "outlined"}
              color={step.completed ? "success" : "default"}
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                height: { xs: 20, sm: 24 },
                "& .MuiChip-label": {
                  px: { xs: 0.5, sm: 1 }
                }
              }}
            />
          ))}
        </Stack>

        {/* Form Fields */}
        <Stack spacing={{ xs: 1, sm: 1.5 }}>
          {/* Year Field */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="#ffffff"
              mb={{ xs: 0.5, sm: 1 }}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <CalendarToday sx={{
                fontSize: { xs: 14, sm: 16 },
                mr: 1,
                verticalAlign: "middle",
                color: "#e2e8f0"
              }} />
              Vehicle Year
            </Typography>
            <TextField
              select
              fullWidth
              value={year}
              onChange={(e) => setYear(e.target.value)}
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: unknown): ReactNode => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#000000' }}>Choose year</span>;
                  }
                  return selected as string;
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: year ? "#f0f9ff" : "#ffffff",
                  "&:hover fieldset": {
                    borderColor: "#3b82f6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                    borderWidth: "1px",
                  },
                }
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#000000" }}>
                Choose year
              </MenuItem>
              {initialData.years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Make Field */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="#ffffff"
              mb={{ xs: 0.5, sm: 1 }}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <DirectionsCar sx={{
                fontSize: { xs: 14, sm: 16 },
                mr: 1,
                verticalAlign: "middle",
                color: "#e2e8f0"
              }} />
              Vehicle Make
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
              select
              fullWidth
              value={make}
              onChange={(e) => {
                setMake(e.target.value)
                setModel('')
              }}
              size="small"
              disabled={!year}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: unknown): ReactNode => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#000000' }}>Choose make</span>;
                  }
                  return selected as string;
                }
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: make ? "#f0f9ff" : year ? "#ffffff" : "#f8fafc",
                  "&:hover fieldset": year ? {
                    borderColor: "#3b82f6",
                  } : {},
                  "&.Mui-focused fieldset": year ? {
                    borderColor: "#3b82f6",
                    borderWidth: "1px",
                  } : {},
                }
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#000000" }}>
                Choose make
              </MenuItem>
              {initialData.makes.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            {/* Selected Make Logo on the right */}
            {make && makeLogos[make] && (
              <Box
                sx={{
                  width: { xs: 70, sm: 85 },
                  height: { xs: 70, sm: 85 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: 1, sm: 1.25 }
                }}
              >
                <img
                  src={makeLogos[make]}
                  alt={make}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                  }}
                />
              </Box>
            )}
            </Box>
            {!year && (
              <Typography variant="caption" color="#d1d5db" mt={0.5}>
                Select year first
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Model Field */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="#ffffff"
              mb={{ xs: 0.5, sm: 1 }}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <Category sx={{
                fontSize: { xs: 14, sm: 16 },
                mr: 1,
                verticalAlign: "middle",
                color: "#e2e8f0"
              }} />
              Vehicle Model
            </Typography>
            <TextField
              select
              fullWidth
              value={model}
              onChange={(e) => setModel(e.target.value)}
              size="small"
              disabled={!make}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: unknown): ReactNode => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#000000' }}>Choose model</span>;
                  }
                  return selected as string;
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: model ? "#f0f9ff" : make ? "#ffffff" : "#f8fafc",
                  "&:hover fieldset": make ? {
                    borderColor: "#3b82f6",
                  } : {},
                  "&.Mui-focused fieldset": make ? {
                    borderColor: "#3b82f6",
                    borderWidth: "1px",
                  } : {},
                }
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#000000" }}>
                Choose model
              </MenuItem>
              {make &&
                initialData.models[make]?.map((mod) => (
                  <MenuItem key={mod} value={mod}>
                    {mod}
                  </MenuItem>
                ))}
            </TextField>
            {!make && (
              <Typography variant="caption" color="#d1d5db" mt={0.5}>
                Select make first
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Part Field */}
          <Box>
            <Typography
              variant="body2"
              fontWeight={500}
              color="#ffffff"
              mb={{ xs: 0.5, sm: 1 }}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              <Build sx={{
                fontSize: { xs: 14, sm: 16 },
                mr: 1,
                verticalAlign: "middle",
                color: "#e2e8f0"
              }} />
              Part Type
            </Typography>
            <TextField
              select
              fullWidth
              value={part}
              onChange={(e) => setPart(e.target.value)}
              size="small"
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected: unknown): ReactNode => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#000000' }}>Choose part</span>;
                  }
                  return selected as string;
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: part ? "#f0f9ff" : "#ffffff",
                  "&:hover fieldset": {
                    borderColor: "#3b82f6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                    borderWidth: "1px",
                  },
                }
              }}
            >
              <MenuItem value="" disabled sx={{ color: "#000000" }}>
                Choose part
              </MenuItem>
              {initialData.parts.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>

                 {/* Search Button */}
         <Button
           fullWidth
           variant="contained"
           size="large"
           onClick={handleSearch}
           disabled={!year || !make || !model || !part}
           startIcon={<Search sx={{ fontSize: { xs: 18, sm: 20 } }} />}
           sx={{
             mt: { xs: 1.5, sm: 2 },
             py: { xs: 1.2, sm: 1.5 },
            borderRadius: 2,
            background: (year && make && model && part)
              ? "#3b82f6"
              : "#e2e8f0",
            color: (year && make && model && part)
              ? "#ffffff"
              : "#94a3b8",
            fontWeight: 600,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            textTransform: "none",
            boxShadow: "none",
            "&:hover": (year && make && model && part) ? {
              background: "#2563eb",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            } : {
              background: "#e2e8f0",
              boxShadow: "none",
            },
            "&:disabled": {
              background: "#e2e8f0",
              color: "#94a3b8",
            },
          }}
        >
          Complete all fields to Search Parts
        </Button>

                 {/* Footer */}
         <Typography
           variant="caption"
           color="#d1d5db"
           textAlign="center"
           display="block"
           mt={{ xs: 1, sm: 1.5 }}
           sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
         >
           ✓ Quality parts • ✓ Fast shipping • ✓ 6 Month warranty
         </Typography>
    </Box>
  )
}

