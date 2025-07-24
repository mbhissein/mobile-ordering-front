import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Divider,
  Paper
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const OrderSummaryDialog = ({ open, onClose, orderSummary }) => {
  if (!orderSummary) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }}>
      <DialogTitle
        sx={{
          backgroundColor: '#800020',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 22,
          textAlign: 'center',
          py: 2,
        }}
      >
        <ReceiptLongIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Bestellübersicht
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fffaf2', px: 3 }}>
        <Typography><strong>Bestellnummer:</strong> {orderSummary.orderNumber}</Typography>
        <Typography><strong>Tischnummer:</strong> {orderSummary.tableId}</Typography>
        <Typography><strong>Kunde:</strong> {orderSummary.customerName}</Typography>
        <Typography><strong>Telefon:</strong> {orderSummary.customerPhone}</Typography>
        <Typography><strong>Anmerkungen:</strong> {orderSummary.specialInstructions}</Typography>
        <Typography><strong>Gesamtbetrag:</strong> {orderSummary.subtotal} €</Typography>
        <Typography><strong>Bestellt am:</strong> {orderSummary.placedAt}</Typography>

        <Box mt={2}>
          {orderSummary.items.map((item, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#fff',
                border: '1px solid #f0e6e6',
                mt: 2
              }}
            >
              <Typography variant="h6" color="#800020" fontWeight="bold">
                {item.quantity}× {item.name}
              </Typography>
              {item.notes && (
                <Typography variant="body2" sx={{ mb: 1 }}>Hinweise: {item.notes}</Typography>
              )}
              {item.components.length > 0 && (
                <Box mt={1}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>Ausgewählte Optionen:</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {item.components.map((comp, i) => (
                      <li key={i} style={{ marginBottom: '4px' }}>
                        <Typography variant="body2">
                          🥗 {comp.value} – <span style={{ color: '#888' }}>{comp.optionName}</span>
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ backgroundColor: '#800020', '&:hover': { backgroundColor: '#a0002a' } }}>
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderSummaryDialog;
