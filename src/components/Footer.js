// src/components/Footer.js
import React from 'react';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import RoomIcon from '@mui/icons-material/Room';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Badge } from '@mui/material';

const Footer = ({ onShowOrderSummary, hasOrder }) => (
  <Paper
    sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      borderTop: '1px solid #ddd',
    }}
    elevation={3}
  >
    <BottomNavigation showLabels>
      <BottomNavigationAction label="Start" icon={<HomeIcon />} />
      
      <BottomNavigationAction
        label="Meine Bestellung"
        icon={
          <Badge
            badgeContent={hasOrder ? 1 : 0}
            color="secondary"
            invisible={!hasOrder}
          >
            <RoomIcon />
          </Badge>
        }
        onClick={onShowOrderSummary}
      />

      <BottomNavigationAction label="Hier bestellen" icon={<RestaurantMenuIcon />} />
      <BottomNavigationAction label="Mehr" icon={<MoreHorizIcon />} />
    </BottomNavigation>
  </Paper>
);

export default Footer;
