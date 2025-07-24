// src/components/BurgerMenu.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  ListItemIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StoreIcon from '@mui/icons-material/Store';
import { Link } from 'react-router-dom';
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded';
// Farbpalette
const colors = {
  primary: '#8B2E2E',
  accent: '#D4AF37',
  background: '#F5EFE6',
  text: '#3E3E3E',
  white: '#FFFFFF',
  border: '#D6CCC2'
};

const BurgerMenu = ({ open, onClose }) => {
  const pages = [
    { name: 'Startseite', path: '/', icon: <HomeIcon sx={{ color: colors.primary }} /> },
    { name: 'Bestellen', path: '/bestellen', icon: <ShoppingCartIcon sx={{ color: colors.primary }} /> },
    { name: 'Menü', path: '/menue', icon: <RestaurantMenuIcon sx={{ color: colors.primary }} /> },
    { name: 'Kategorie', path: '/kategorie', icon: <CategoryIcon sx={{ color: colors.primary }} /> },
    { name: 'Selbstabholung', path: '/selbstabholung', icon: <AssignmentTurnedInIcon sx={{ color: colors.primary }} /> },
    { name: 'Restaurant', path: '/restaurant', icon: <StoreIcon sx={{ color: colors.primary }} /> },
    { name: 'Tische', path: '/tische', icon: <TableRestaurantRoundedIcon sx={{ color: colors.primary }} /> },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 280,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.white,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            py: 2,
            backgroundColor: colors.primary,
            color: colors.white,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Navigation
          </Typography>
          <IconButton onClick={onClose} sx={{ color: colors.white }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Menüeinträge */}
        <List sx={{ flexGrow: 1 }}>
          {pages.map((page) => (
            <ListItem
              button
              key={page.name}
              component={Link}
              to={page.path}
              onClick={onClose}
              sx={{
                px: 3,
                py: 1.5,
                '&:hover': {
                  backgroundColor: colors.background,
                },
              }}
            >
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={500} sx={{ color: colors.text }}>
                    {page.name}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="caption" sx={{ color: colors.text }}>
            © 2025 Marrakesch Dortmund
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BurgerMenu;
