import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  useMediaQuery,
  Paper,
  Typography,
  TextField,
  useTheme,
  Button,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";

function Selbstabholung() {
  const [code, setCode] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalDuration = 0.5 * 60 * 1000; // 0.5 Minuten
  const [done, setDone] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Audio-Referenz
  const audioRef = useRef(null);

  // Farbpalette Marrakesch-Stil
  const colors = {
    background: '#F5EFE6',
    card: '#FFFFFF',
    primaryText: '#8B2E2E',
    secondaryText: '#3E3E3E',
    border: '#D4AF37',
    progress: '#8B2E2E',
    readyBg: '#E6FFE6',
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval;
    const start = Date.now();

    if (showStatus) {
      interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(percent);

        if (percent >= 100) {
          clearInterval(interval);
          setDone(true);

          // Ton abspielen – funktioniert nun auch auf iOS
          if (audioRef.current) {
            audioRef.current.play().catch((e) =>
              console.error("Sound konnte nicht abgespielt werden:", e)
            );
          }

              // Vibration hinzufügen (wenn unterstützt)
          const canVibrate = window.navigator.vibrate;
          if (canVibrate) {
            window.navigator.vibrate(100); // Vibriert 100 ms, wenn unterstützt
          }


      
         
          // Push Notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("✅ Deine Bestellung ist abholbereit!", {
              body: "Komm vorbei und hol sie ab.",
              icon: "/icons/bell.png"
            });
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showStatus]);

  const handleSubmit = () => {
    if (code.trim()) {
      // Audio-Objekt vorbereiten bei User-Geste (Pflicht für iOS)
      if (!audioRef.current) {
        audioRef.current = new Audio('/ding.mp3');
        audioRef.current.load(); // optional, hilft bei manchen Geräten
      }

      setShowStatus(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, p: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ borderRadius: 4, p: isMobile ? 3 : 6, backgroundColor: colors.white }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: colors.primaryText }}
          >
            Selbstabholung
          </Typography>

          {!showStatus ? (
            <>
              <Typography variant="body1" sx={{ color: colors.secondaryText, mb: 3 }}>
                Bitte gib deine Abholnummer ein
              </Typography>
              <TextField
                label="Abholcode"
                variant="outlined"
                type="number"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              {code.trim() !== '' && (
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: colors.primaryText,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#732121'
                    }
                  }}
                  onClick={handleSubmit}
                  fullWidth
                >
                  Bestätigen
                </Button>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={120}
                  thickness={5}
                  sx={{ color: colors.progress }}
                />
                <Box sx={{
                  top: 0, left: 0, bottom: 0, right: 0,
                  position: 'absolute', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <Typography variant="caption" sx={{ color: colors.secondaryText }}>
                    {`${Math.round(progress)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ color: colors.secondaryText }}>
                Bestellung in Vorbereitung...
              </Typography>

              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      marginTop: 20,
                      padding: 16,
                      backgroundColor: colors.readyBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 8
                    }}
                  >
                    <Typography variant="h6" sx={{ color: colors.primaryText }}>
                      ✅ Deine Bestellung ist jetzt abholbereit!
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Selbstabholung;
