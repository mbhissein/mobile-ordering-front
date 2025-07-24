// src/components/QRScanner.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [cameraId, setCameraId] = useState('');
  const [availableCameras, setAvailableCameras] = useState([]);

  useEffect(() => {
   Html5Qrcode.getCameras().then(devices => {
  if (devices && devices.length) {
    setCameraId(devices[0].id);
  } else {
    console.error("Keine Kameras gefunden");
  }
}).catch(err => {
  console.error("Fehler beim Abrufen der Kameras:", err);
});

  }, []);

  useEffect(() => {
    if (cameraId) {
      const scanner = new Html5Qrcode("qr-reader");
      scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          scanner.stop().then(() => scanner.clear());
        },
        (errorMessage) => {
          // optional: handle scan errors
        }
      );

      scannerRef.current = scanner;

      return () => {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      };
    }
  }, [cameraId, onScanSuccess]);

  return (
    <Box mt={2}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="kamera-auswahl-label">Kamera auswählen</InputLabel>
        <Select
          labelId="kamera-auswahl-label"
          value={cameraId}
          label="Kamera auswählen"
          onChange={(e) => setCameraId(e.target.value)}
        >
          {availableCameras.map((cam) => (
            <MenuItem key={cam.id} value={cam.id}>
              {cam.label || `Kamera ${cam.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box id="qr-reader" sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }} />

      <Typography variant="caption" display="block" align="center" mt={2} color="text.secondary">
        Richte deine Kamera auf den QR-Code auf deinem Tisch.
      </Typography>
    </Box>
  );
};

export default QRScanner;
