import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog, DialogTitle, DialogContent,DialogActions,
  Grid
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';
import Switch from '@mui/material/Switch';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const API_URL = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/restaurants';

function Restaurant() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [feedback, setFeedback] = useState({
  open: false,
  message: '',
  severity: 'success' // 'error', 'info', 'warning' oder 'success'
});
const [updatedRestaurant, setUpdatedRestaurant] = useState({
  id: '',
  name: '',
  address: '',
  phone: '',
  email: '',
  description: ''
});

const handleToggleStatus = async (restaurant) => {
  try {
    if (restaurant.isActive) {
      // Deaktivieren
      await axios.delete(`${API_URL}/${restaurant.id}`);
      showFeedback('Restaurant wurde deaktiviert.', 'info');
    } else {
      // Reaktivieren
      await axios.patch(`${API_URL}/${restaurant.id}/reactivate`);
      showFeedback('Restaurant wurde reaktiviert.', 'success');
    }

    fetchRestaurants();
  } catch (error) {
    console.error('Fehler beim Umschalten des Status:', error);
    showFeedback('Statusänderung fehlgeschlagen.', 'error');
  }
};


const showFeedback = (message, severity = 'success') => {
  setFeedback({ open: true, message, severity });
};


const handleUpdate = async () => {
  try {
    const { id, name, description, address, phone, email } = updatedRestaurant;

    const response = await axios.patch(`${API_URL}/${id}`, {
      name,
      description,
      address,
      phone,
      email,
    });

    if (response.status === 200) {
      fetchRestaurants();
      handleDialogClose();
      showFeedback('Restaurant erfolgreich aktualisiert!', 'success');
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Restaurants:', error);
    showFeedback('Fehler beim Aktualisieren des Restaurants.', 'error');
  }
};


const handleDialogClose = () => {
  setEditDialogOpen(false);
  setUpdatedRestaurant({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    description: ''
  });
};





  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get(API_URL);
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Fehler beim Laden der Restaurants:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(API_URL, form);
    setForm({ name: '', description: '', address: '', phone: '', email: '' });
    setShowForm(false);
    fetchRestaurants();
    showFeedback('Restaurant erfolgreich gespeichert!', 'success');
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    showFeedback('Fehler beim Speichern des Restaurants.', 'error');
  }
};


const handleDelete = async (id) => {
  if (!window.confirm('Möchtest du dieses Restaurant wirklich löschen?')) return;

  try {
    await axios.delete(`${API_URL}/${id}/hard`);
    fetchRestaurants();
    showFeedback('Restaurant erfolgreich gelöscht.', 'success');
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    showFeedback('Fehler beim Löschen des Restaurants.', 'error');
  }
};


  const colors = {
    primary: '#8B2E2E',
    accent: '#D4AF37',
    background: '#F5EFE6',
    text: '#3E3E3E',
    white: '#FFFFFF',
    border: '#D6CCC2'
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: colors.white,
      '& fieldset': {
        borderColor: colors.border
      },
      '&:hover fieldset': {
        borderColor: colors.accent
      },
      '&.Mui-focused fieldset': {
        borderColor: colors.primary,
        borderWidth: 2
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 4, p: isMobile ? 3 : 5, backgroundColor: colors.white }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: colors.primary }}>
              Restaurants
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.primary,
                '&:hover': { backgroundColor: colors.accent },
                color: 'white'
              }}
              startIcon={<AddIcon />}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Abbrechen' : 'Hinzufügen'}
            </Button>
          </Box>

          <Divider sx={{ mb: 4, borderColor: colors.border }} />

          {showForm ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              gap={3}
              alignItems="center"
            >
              {[
                { label: 'Name', name: 'name', icon: <RestaurantIcon /> },
                { label: 'Beschreibung', name: 'description', icon: <DescriptionIcon />, multiline: true, rows: 3 },
                { label: 'Adresse', name: 'address', icon: <LocationOnIcon /> },
                { label: 'Telefon', name: 'phone', icon: <PhoneIcon /> },
                { label: 'E-Mail', name: 'email', icon: <EmailIcon />, type: 'email' }
              ].map(({ label, name, icon, multiline, rows, type }) => (
                <TextField
                  key={name}
                  label={label}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  fullWidth
                  type={type || 'text'}
                  variant="outlined"
                  multiline={multiline}
                  rows={rows}
                  sx={{ ...textFieldStyle, maxWidth: 600 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {React.cloneElement(icon, { sx: { color: colors.accent } })}
                      </InputAdornment>
                    )
                  }}
                />
              ))}

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  backgroundColor: colors.primary,
                  '&:hover': { backgroundColor: colors.accent },
                  color: 'white'
                }}
              >
                Speichern
              </Button>
            </Box>
          ) : (
           <List>
  {restaurants.map((restaurant) => (




    <ListItem
      key={restaurant.id}
      divider
      sx={{
        '&:hover': {
          backgroundColor: `${colors.background}`,
          borderRadius: 2,
          boxShadow: 2,
        },
        alignItems: 'flex-start',
        py: 2,
        px: 2,
        transition: '0.2s ease'
      }}
      secondaryAction={
      <Box display="flex" alignItems="center" gap={1}>
          {/* Status Switch */}
        <Switch
        checked={restaurant.isActive}
       onChange={() => handleToggleStatus(restaurant)}
       color="success"
        />


          {/* Edit Button nur wenn aktiv */}
          {restaurant.isActive && (
            <IconButton
              edge="end"
              aria-label="bearbeiten"
              onClick={() => {
                setUpdatedRestaurant(restaurant);
                setEditDialogOpen(true);
              }}
            >
              <EditIcon sx={{ color: colors.primary }} />
            </IconButton>
          )}

          {/* Delete Button bleibt immer sichtbar */}
          <IconButton edge="end" aria-label="löschen" onClick={() => handleDelete(restaurant.id)}>
            <DeleteIcon sx={{ color: 'darkred' }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon sx={{ mt: 0.5 }}>
        <StoreIcon sx={{ color: colors.primary }} />
      </ListItemIcon>

      <ListItemText
        primary={
          <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 'bold' }}>
            {restaurant.name}
          </Typography>

          


        }
        secondary={
         <Box sx={{ mt: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <DescriptionIcon sx={{ fontSize: 18, color: colors.accent }} />
              <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                {restaurant.description}
              </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <LocationOnIcon sx={{ fontSize: 18, color: colors.accent }} />
            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
              {restaurant.address}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <PhoneIcon sx={{ fontSize: 18, color: colors.accent }} />
            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
              {restaurant.phone}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon sx={{ fontSize: 18, color: colors.accent }} />
            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
              {restaurant.email}
            </Typography>
          </Box>


{/*
<Box display="flex" alignItems="center" gap={1}>
  <FiberManualRecordIcon
    sx={{
      fontSize: 14,
      color: restaurant.isActive ? 'green' : 'gray'
    }}
  />
  <Typography variant="caption" sx={{ color: restaurant.isActive ? 'green' : 'gray' }}>
    {restaurant.isActive ? 'Aktiv' : 'Inaktiv'}
  </Typography>
</Box>

*/}


</Box>

        }
      />
    </ListItem>
  ))}

  {restaurants.length === 0 && (
    <Typography variant="body1" sx={{ color: colors.text }} align="center" mt={2}>
      Keine Restaurants gefunden.
    </Typography>


  )}
</List>

  


          )}

          
        </Paper>
      </Container>
  
  <Snackbar
  open={feedback.open}
  autoHideDuration={4000}
  onClose={() => setFeedback({ ...feedback, open: false })}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setFeedback({ ...feedback, open: false })}
    severity={feedback.severity}
    sx={{ width: '100%' }}
  >
    {feedback.message}
  </Alert>
</Snackbar>


<Dialog open={editDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
  <DialogTitle sx={{ color: colors.primary, fontWeight: 'bold' }}>
    Restaurant bearbeiten
  </DialogTitle>
  <DialogContent dividers>
    <Grid container spacing={2}>
      {[
        { label: 'Name', name: 'name', icon: <RestaurantIcon /> },
        { label: 'Beschreibung', name: 'description', icon: <DescriptionIcon />, multiline: true, rows: 3 },
        { label: 'Adresse', name: 'address', icon: <LocationOnIcon /> },
        { label: 'Telefon', name: 'phone', icon: <PhoneIcon /> },
        { label: 'E-Mail', name: 'email', icon: <EmailIcon />, type: 'email' }
      ].map(({ label, name, icon, multiline, rows, type }) => (
        <Grid item xs={12} key={name}>
          <TextField
            label={label}
            name={name}
            value={updatedRestaurant[name]}
            onChange={(e) =>
              setUpdatedRestaurant({ ...updatedRestaurant, [e.target.name]: e.target.value })
            }
            required
            fullWidth
            type={type || 'text'}
            variant="outlined"
            multiline={multiline}
            rows={rows}
            sx={textFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {React.cloneElement(icon, { sx: { color: colors.accent } })}
                </InputAdornment>
              )
            }}
          />
        </Grid>
      ))}
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button
      onClick={handleDialogClose}
      sx={{
        backgroundColor: colors.border,
        color: colors.text,
        '&:hover': {
          backgroundColor: '#ccc'
        }
      }}
    >
      Abbrechen
    </Button>
    <Button
      onClick={handleUpdate}
      variant="contained"
      sx={{
        backgroundColor: colors.primary,
        '&:hover': { backgroundColor: colors.accent },
        color: 'white'
      }}
    >
      Aktualisieren
    </Button>
  </DialogActions>
</Dialog>




      
    </Box>

    
  );
}

export default Restaurant;
