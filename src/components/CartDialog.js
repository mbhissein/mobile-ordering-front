import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box,
  Tooltip,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EuroIcon from '@mui/icons-material/Euro';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const Order_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/orders';


const CartDialog = ({ open, onClose, setCartItems, cartItems, handleRemove, handleQuantityChange, selectedRestaurantId,  setOrderSummary}) => {

console.log("cartItems",cartItems);
  
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const handleCheckout = async () => {
  const cleanedCart = cartItems.map((item) => ({
    quantity: item.quantity,
    menuItemId: item.menuItemId, // korrekt!
    specialNotes: item.specialNotes || '', // leeres Feld, falls nichts vorhanden
    components: (item.components || [])
      .flat()
      .map((c) => ({
        value: c.value,
        optionId: c.optionId,
      })),
  }));

  const payload = {
    type: 'TABLE_SERVICE',
    restaurantId: selectedRestaurantId, // z. B. "rest_cuid_123"
   // tableId: 'table_cuid_123',
   // customerId: 'user_cuid_123',
    customerName: 'John Doe',
    customerPhone: '+491622852525',
    specialInstructions: 'No onions, extra sauce',
    tableId: 'cmdgdboey0002me014bgdvkpc',
    orderItems: cleanedCart,
  };

 try {
  const response = await axios.post(Order_API, payload);

  if (response.status === 200 || response.status === 201) {
    const data = response.data;

    console.log("statusHistory", data.statusHistory);

    const summary = {
      status: data.statusHistory[0].status,
      statusNotes: data.statusHistory[0].notes,
      orderId: data.id,
      tableId: data.tableId,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      specialInstructions: data.specialInstructions,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
        placedAt: data.placedAt,
   //   placedAt: new Date(data.placedAt).toLocaleString(),
      items: data.orderItems.map((item) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        total: item.totalPrice,
        notes: item.specialNotes,
        components: item.components?.map((c) => ({
          value: c.value,
          optionName: c.optionName,
        })) || [],
      })),
    };

    // 🟢 Order ID im localStorage speichern (für spätere Nutzung)
    localStorage.setItem('currentOrderId', data.id);

    setOrderSummary(summary);
    setCartItems([]);
    onClose();
    console.log('✅ Bestellung erfolgreich:', summary);
    console.log('✅ OrderSummary:', summary);

  } else {
    console.error('❌ Fehler beim Senden der Bestellung:', response.status);
  }
} catch (error) {
  console.error('❌ Netzwerkfehler:', error);
}

};




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
        <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Ihr Warenkorb
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fffaf2', px: 3 }}>
        {cartItems.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            Ihr Warenkorb ist leer.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {cartItems.map((item, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #f0e6e6',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Typography variant="h6" color="#800020" fontWeight="bold">
                      {item.menuName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.description}
                    </Typography>

{Array.isArray(item.components) && item.components.length > 0 && (
  <Box mt={2}>
    <Box component="ul" sx={{ pl: 2, m: 0 }}>
      {item.components.flat().map((c, i) => (
        <li key={i} style={{ marginBottom: '4px' }}>
          <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>🥗 {c.value}:</span>{' '}
            <span style={{ color: '#d4af37' }}>
              {Array.isArray(c.optionName) ? c.optionName.join(', ') : c.optionName}
            </span>
          </Typography>
        </li>
      ))}
    </Box>
  </Box>
)}


                  </Box>

                  <Tooltip title="Entfernen">
                    <IconButton onClick={() => handleRemove(index)} sx={{ color: '#800020' }}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}
                      sx={{ color: '#800020' }}
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" fontWeight="bold">
                      {item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      sx={{ color: '#800020' }}
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Typography fontWeight="bold" fontSize={16} color="#800020">
                    {(item.price * item.quantity).toFixed(2)} €
                    <EuroIcon sx={{ fontSize: 18, ml: 0.5 }} />
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>

      <Box sx={{ backgroundColor: '#fffaf2', px: 3, py: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Zwischensumme
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#800020">
            {total.toFixed(2)} €
          </Typography>
        </Box>
      </Box>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Zurück
        </Button>
       <Button
  variant="contained"
  fullWidth
  onClick={handleCheckout}
  sx={{
    backgroundColor: '#800020',
    color: '#fff',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#a0002a',
    },
  }}
>
  Zur Kasse
</Button>

      </DialogActions>
    </Dialog>

    
  );

 

};

export default CartDialog;
