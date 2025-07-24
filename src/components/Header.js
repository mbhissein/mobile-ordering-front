// Header.js
import React from 'react';
import { Box, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import BurgerMenu from './BurgerMenu';

const Header = ({ cartItemCount,onCartClick }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          backgroundColor: 'white',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 32, transform: 'scale(2)', transformOrigin: 'left center' }}
          />
        </Box>

        <IconButton onClick={onCartClick} sx={{ transform: 'scale(1.4)' }}>
          <Badge badgeContent={cartItemCount} color="error">
            <ShoppingCartIcon sx={{ color: '#e60000' }} />
          </Badge>
        </IconButton>
      </Box>

      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
