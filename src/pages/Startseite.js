// src/pages/Startseite.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Grid
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QRScanner from '../components/QRScanner';
import { useNavigate } from 'react-router-dom';
       import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
// Farbpalette (kann alternativ zentral importiert werden)
const colors = {
  primary: '#8B2E2E',
  accent: '#D4AF37',
  background: '#F5EFE6',
  text: '#3E3E3E',
  white: '#FFFFFF',
  border: '#D6CCC2'
};

function Startseite() {
  const [showScanner, setShowScanner] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const navigate = useNavigate();

  const handleQrScan = (text) => {
    try {
      const url = new URL(text);
      if (url.pathname === '/menue') {
        setScanError('');
        setQrResult(text);
        navigate(`${url.pathname}${url.search}`);
      } else {
        setScanError('Dieser QR-Code ist ungültig.');
      }
    } catch (e) {
      setScanError('Fehler beim Scannen des QR-Codes.');
    }
   };

   const handleLoadDocumentation = () => {
  // Hier kommt deine Logik zum Laden der Dokumentation rein
  console.log('Dokumentation laden geklickt');
};

const handleNewDocumentation = () => {
  // Hier kommt deine Logik zum Erstellen neuer Dokumentation rein
  console.log('Neue Dokumentation erstellen geklickt');
};

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={4} sx={{ borderRadius: 3, p: 4, bgcolor: colors.background }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ color: colors.primary }}>
          Herzlich Willkommen
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 3, color: colors.text }}
        >
          Bitte wähle aus, wie Du bei uns bestellen möchtest.
        </Typography>

        {!showScanner && (
          <Grid container spacing={2} justifyContent="center">


<Grid item xs={12}>
  <Button
    variant="outlined"
    fullWidth
    onClick={() => handleLoadDocumentation()}
    sx={{
      display: 'flex',
      alignItems: 'center',
      borderLeft: `6px solid ${colors.primary}`,
      px: 2,
      py: 2,
      bgcolor: colors.white,
      color: colors.text,
      borderColor: colors.border,
      '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: colors.accent
      },
      textAlign: 'left',
      mb: 2
    }}
  >
    <FolderOpenIcon sx={{ fontSize: 40, color: colors.primary, mr: 2 }} />
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.primary }}>
        Dokumentation laden
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text }}>
        Vorhandene Dokumentation anhand einer Auftragsnummer laden.
      </Typography>
    </Box>
  </Button>

  <Button
    variant="outlined"
    fullWidth
    onClick={() => handleNewDocumentation()}
    sx={{
      display: 'flex',
      alignItems: 'center',
      borderLeft: `6px solid ${colors.primary}`,
      px: 2,
      py: 2,
      bgcolor: colors.white,
      color: colors.text,
      borderColor: colors.border,
      '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: colors.accent
      },
      textAlign: 'left'
    }}
  >
    <NoteAddIcon sx={{ fontSize: 40, color: colors.primary, mr: 2 }} />
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: colors.primary }}>
        Neue Dokumentation
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text }}>
        Neue Installationsdokumentation erstellen.
      </Typography>
    </Box>
  </Button>
</Grid>

          </Grid>
        )}

        {showScanner && (
          <Box mt={3}>
            <Typography align="center" variant="body2" sx={{ color: colors.text }}>
              Bitte scanne den QR-Code auf deinem Tisch
            </Typography>
            <QRScanner onScanSuccess={handleQrScan} />
          </Box>
        )}

        {scanError && (
          <Box mt={2}>
            <Typography variant="body2" color="error" align="center">
              {scanError}
            </Typography>
          </Box>
        )}

        {qrResult && !scanError && (
          <Box mt={3} textAlign="center">
            <Typography variant="subtitle1" sx={{ color: colors.primary }}>
              Scan erfolgreich:
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text }}>
              {qrResult}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Startseite;
