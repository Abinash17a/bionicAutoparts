import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface ModalSectionProps {
  modalVisible: boolean;
  searchedPart: {
    years: string[];
    makes: string[];
    models: string[];
    parts: string[];
  } | null;
  name: string;
  setName: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleModalClose: () => void;
  isSubmitClicked: boolean;
}

export const ModalSection: React.FC<ModalSectionProps> = ({ modalVisible, searchedPart, name, setName, contact, setContact, email, setEmail, zipCode, setZipCode, handleSubmit, handleModalClose, isSubmitClicked }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={modalVisible}
      onClose={handleModalClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: { xs: 2, sm: 4 },
          m: 1,
          background: '#fff',
          boxShadow: 8,
          maxHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
      aria-labelledby="modal-title"
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' }, letterSpacing: '-0.01em', color: '#1e293b' }} id="modal-title">
        {searchedPart?.years.join(', ')} {searchedPart?.makes.join(', ')} {searchedPart?.models.join(', ')} {searchedPart?.parts.join(', ')}
        <IconButton
          aria-label="close"
          onClick={handleModalClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                variant="outlined"
                autoComplete="name"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Contact Number"
                value={contact.startsWith('+1') ? contact : `+1${contact}`}
                onChange={(e) => {
                  let value = e.target.value;
                  // Remove +1 prefix for processing
                  if (value.startsWith('+1')) {
                    value = value.substring(2);
                  }
                  // Only allow digits and limit to 10 digits
                  value = value.replace(/\D/g, '').substring(0, 10);
                  setContact(value);
                }}
                fullWidth
                required
                variant="outlined"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 123-4567"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                variant="outlined"
                type="email"
                autoComplete="email"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                fullWidth
                required
                variant="outlined"
                autoComplete="postal-code"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  background: isSubmitClicked ? '#94a3b8' : '#2563eb',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.15)',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    background: isSubmitClicked ? '#94a3b8' : '#1d4ed8',
                  },
                  transition: 'all 0.2s ease',
                }}
                disabled={isSubmitClicked}
              >
                Search
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="button"
                onClick={handleModalClose}
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderColor: '#cbd5e1',
                  background: '#f1f5f9',
                  '&:hover': {
                    background: '#e2e8f0',
                    borderColor: '#94a3b8',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}

