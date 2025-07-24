// src/pages/MenuePage.js
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Container, Paper, Box } from '@mui/material';

function MenuePage() {
  const [params] = useSearchParams();
  const tisch = params.get('tisch');
  const restaurantId = params.get('restaurant');

  const colors = {
    background: '#F5EFE6',
    card: '#FFFFFF',
    primaryText: '#8B2E2E',
    secondaryText: '#3E3E3E',
    border: '#D4AF37'
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 8,
        backgroundColor: colors.background,
        borderRadius: 3,
        p: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          p: 4,
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: colors.primaryText, fontWeight: 'bold' }}
        >
          Menü für Tisch {tisch || 'unbekannt'}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: colors.secondaryText }}
        >
          Restaurant ID: {restaurantId || 'nicht angegeben'}
        </Typography>

        <Box mt={2}>
          <Typography sx={{ color: colors.secondaryText }}>
            Speisekarte folgt ...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default MenuePage;
