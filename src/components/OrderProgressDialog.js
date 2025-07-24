import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  LinearProgress,
  Box,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

const TOTAL_MINUTES = 20;

const OrderProgressDialog = ({ open, onClose, placedAt }) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(TOTAL_MINUTES);

  useEffect(() => {
    if (!placedAt) return;

    const startTime = new Date(placedAt).getTime();
    const endTime = startTime + TOTAL_MINUTES * 60 * 1000;

    const updateProgress = () => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      const totalDuration = endTime - startTime;

      const percentage = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(Math.floor(percentage));

      const remainingMs = Math.max(0, endTime - now);
      const remainingMin = Math.ceil(remainingMs / 60000);
      setRemainingTime(remainingMin);
    };

    updateProgress(); // Initial
    const interval = setInterval(updateProgress, 10000); // alle 10 Sekunden
    return () => clearInterval(interval);
  }, [placedAt]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Bestellstatus
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" alignItems="center" mb={2} gap={1}>
          <AccessTimeIcon color="primary" />
          <Typography variant="body1">
            Deine Bestellung wird vorbereitet...
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Geschätzte Gesamtzeit: {TOTAL_MINUTES} Minuten
        </Typography>

        <LinearProgress 
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />

        <Typography variant="caption" display="block" align="right" sx={{ mt: 1 }}>
          {progress}% abgeschlossen – Noch ca. {remainingTime} Minute{remainingTime !== 1 ? 'n' : ''}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default OrderProgressDialog;
