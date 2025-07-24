import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider, useTheme, useMediaQuery,
  InputAdornment, IconButton, List, ListItem, ListItemText, ListItemIcon,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select,
  FormControl, InputLabel, Snackbar, Alert
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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CategoryIcon from '@mui/icons-material/Category';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Switch from '@mui/material/Switch';
import { Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EuroIcon from '@mui/icons-material/Euro'; // oder ein passendes Preis-Icon
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {  Checkbox, FormGroup, FormControlLabel, RadioGroup, Radio} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import {  LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AnimatePresence, motion } from 'framer-motion';




const RESTAURANT_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/restaurants';
const CATEGORY_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/categories';
const Menu_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/items';
const Attribut_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components';
const Options_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components/options';
const Order_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components/options';

export default function Restaurant({open, onClose, cartItems, setCartItems, setSelectedRestaurantId, selectedRestaurantId, orderSummary }) {
const TOTAL_MINUTES = 20; // Standard-Wartezeit
  const [restaurants, setRestaurants] = useState([]);
  //const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ 
    name: '', 
    description: '', 
    sortOrder: 1 
  });
    const [menuForm, setMenuForm] = useState({ 
      name: '', 
      description: '', 
      price: '',
      image: ''
    });

  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [showAddForm, setShowAddForm] = useState(false);
    const [showAddMenuForm, setShowAddMenuForm] = useState(false);
    const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
const [selectedMenüs, setSelectedMenüs] = useState(null);

const [formErrors, setFormErrors] = useState({});
const [updatedCategory, setUpdatedCategory] = useState({
  id: '',
  name: '',
  address: '',
  phone: '',
  email: '',
  description: ''
});
const [editDialogMenuOpen, setEditDialogMenuOpen] = useState(false);
const [type, setType] = useState('TABLE_SERVICE');
const [tableId, setTableId] = useState('9');


const [updatedMenu, setUpdatedMenu] = useState({
  id: '',
  name: '',
  description: '',
  price: '',
  restaurantId:'',
  image: '',
});
const [menus, setMenus] = useState([]);
const [attribute, setAttribute] = useState([]);

const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
const [menuDialogOpen, setMenuDialogOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null); // für Bearbeiten
const [editDialogOpen, setEditDialogOpen] = useState(false);
  const theme = useTheme();
  const [copiedAttributes, setCopiedAttributes] = useState([]);
 const [selectedOptions, setSelectedOptions] = useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const [copySuccess, setCopySuccess] = useState(false);
const [cart, setCart] = useState([]);
const [remainingMinutes, setRemainingMinutes] = useState(TOTAL_MINUTES);
const [cartDialogOpen, setCartDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);

const [showReadyMessage, setShowReadyMessage] = useState(false);
const [hasNotified, setHasNotified] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(RESTAURANT_API);
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };




useEffect(() => {
  if (!orderSummary?.placedAt) return;


  const startTime = new Date(orderSummary.placedAt).getTime();
  const endTime = startTime + TOTAL_MINUTES * 60 * 1000;

const updateProgress = () => {
  const now = Date.now();
  const percentage = Math.min(100, ((now - startTime) / (endTime - startTime)) * 100);
  setProgress(Math.floor(percentage));

  const remaining = Math.ceil((endTime - now) / (1000 * 60));
  setRemainingMinutes(Math.max(0, remaining)); // ⏳ nicht negativ

  if (percentage >= 100 && !hasNotified) {
    setShowReadyMessage(true);
    setHasNotified(true);

    // 🔔 Notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🍽️ Deine Bestellung ist bereit zur Abholung!");
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("🍽️ Deine Bestellung ist bereit zur Abholung!");
        }
      });
    }
  }
};


  updateProgress();
  const interval = setInterval(updateProgress, 10000); // alle 10s
  return () => clearInterval(interval);
}, [orderSummary?.placedAt, hasNotified]);





  const fetchCategories = async (restaurantId) => {
    try {
      const res = await axios.get(`${CATEGORY_API}/restaurant/${restaurantId}`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (orderSummary) {
      console.log('✅ Es gibt bereits eine Bestellung:', orderSummary);
      // Du kannst hier z. B. eine Warnung anzeigen oder Navigation blockieren
    }
  }, [orderSummary]);
  
useEffect(() => {
  if (categories.length > 0 && !selectedCategoryId) {
    setSelectedCategoryId(categories[0].id);
  }
}, [categories]);

  const showFeedback = (message, severity = 'success') => {
  setFeedback({ open: true, message, severity });
};

  const validateForm = () => {
  const errors = {};
  if (!categoryForm.name.trim()) errors.name = 'Name ist erforderlich';
  if (!categoryForm.description.trim()) errors.description = 'Beschreibung ist erforderlich';
  if (!categoryForm.sortOrder) errors.sortOrder = 'Sortierreihenfolge ist erforderlich';
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


  const validateMenuForm = () => {
  const errors = {};
  if (!menuForm.name.trim()) errors.name = 'Name ist erforderlich';
  if (!menuForm.description.trim()) errors.description = 'Beschreibung ist erforderlich';
  if (!menuForm.price) errors.sortOrder = 'Der Preis ist erforderlich';
  if (!menuForm.image) menuForm.image = '/images/lamb-tagine.jpg';

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const validateMenuUpdateForm = () => {
  const errors = {};
  if (!updatedMenu.name.trim()) errors.name = 'Name ist erforderlich';
  if (!updatedMenu.description.trim()) errors.description = 'Beschreibung ist erforderlich';
  if (!updatedMenu.price) errors.sortOrder = 'Der Preis ist erforderlich';
  if (!updatedMenu.image) menuForm.image = '/images/lamb-tagine.jpg';

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

 const handleQuantityChange = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
  };

  const handleRemove = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

const fetchMenus = async (restaurantId) => {
  try {
    const res = await axios.get(`${RESTAURANT_API}/${restaurantId}/menu`);
    setMenus(res.data.categories); // Speichere komplette Menüstruktur (mit Kategorien + MenüItems)
  } catch (err) {
    console.error('Fehler beim Laden der Menüs:', err);
  }
};

const handleClose = () => {
  setSelectedMenüs(null); // oder dein eigener Schließ-Mechanismus
  setAttributeDialogOpen(false)
};













const handleUpdate = async () => {
  try {
    const { id, name, description, sortOrder} = updatedCategory;


    const response = await axios.patch(`${CATEGORY_API}/${id}`, {
      name,
      description,
      sortOrder,
   
    });

    if (response.status === 200) {
      fetchCategories();
      handleDialogClose();
      showFeedback('Kategorie erfolgreich aktualisiert!', 'success');
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Kategorie:', error);
    showFeedback('Fehler beim Aktualisieren der Kategorie.', 'error');
  }
};





const handleAddToCart = () => {
  const components = Object.values(selectedOptions);

 
  const orderItem = {
    menuItemId: selectedMenüs.id,
    menuName: selectedMenüs.name,
    price: selectedMenüs.price,
    description: selectedMenüs.description,
    quantity: 1,
    components: components,
  };

  // Statt lokalem setCartItems → verwende das vom App.js:
  setCartItems((prev) => [...prev, orderItem]);

  // Dialog schließen und aufräumen
  setAttributeDialogOpen(false);
  setSelectedMenüs(null);
  setSelectedOptions({});
};




const handleSubmitOrder = async () => {
  const payload = {
    type: 'TABLE_SERVICE',
    restaurantId: selectedRestaurantId,
    tableId: '9',
    customerId: '9',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    specialInstructions: 'No onions, extra sauce',
    orderItems: cartItems
  };

  try {
    await axios.post(`${Order_API}`, payload);
    setCartItems([]);
    setCartDialogOpen(false);
    showFeedback('Bestellung erfolgreich gesendet!', 'success');
  } catch (error) {
    console.error(error);
    showFeedback('Fehler beim Senden der Bestellung.', 'error');
  }
};

const handleUpdateMenu = async () => {
    if (!validateMenuUpdateForm()) return;
  try {
    const { id, name, description, price, restaurantId, image} = updatedMenu;


    const response = await axios.patch(`${Menu_API}/${id}`, {
      name,
      description,
      price,
      image
   
    });

    if (response.status === 200) {
     // fetchCategories();
      fetchMenus(restaurantId);

      handleDialogMenuClose();
      showFeedback('Menu erfolgreich aktualisiert!', 'success');
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Menus:', error);
    showFeedback('Fehler beim Aktualisieren des Menus.', 'error');
  }
};

const handleDialogClose = () => {
  setEditDialogOpen(false);
  setUpdatedCategory({
    id: '',
    name: '',
    description: '',
    sortOrder: ''
  });
};

const handleDialogMenuClose = () => {
  setEditDialogMenuOpen(false);
  setUpdatedMenu({
    id: '',
    name: '',
    description: '',
    price: ''
  });
};

const handleCategorySubmit = async () => {
  if (!validateForm()) return;

  try {
    const payload = { ...categoryForm, restaurantId: selectedRestaurantId };
    await axios.post(Menu_API, payload);
    fetchCategories(selectedRestaurantId);
    setCategoryForm({ name: '', description: '', sortOrder: 1 });
    setShowAddForm(false);
    setFormErrors({});
    setFeedback({ open: true, message: 'Kategorie erfolgreich hinzugefügt.', severity: 'success' });
  } catch (err) {
    console.error(err);
    setFeedback({ open: true, message: 'Fehler beim Hinzufügen der Kategorie.', severity: 'error' });
  }
};

const handleMenuSubmit = async () => {
  if (!validateMenuForm()) return;

  try {
    const payload = { ...menuForm, categoryId: selectedCategoryId };
    await axios.post(Menu_API, payload);
    fetchMenus(selectedRestaurantId);
    setMenuForm({ name: '', description: '', price: '', image: ''});

    setShowAddMenuForm(false);
    setFormErrors({});
    setFeedback({ open: true, message: 'Menü erfolgreich hinzugefügt.', severity: 'success' });
  } catch (err) {
    console.error(err);
    setFeedback({ open: true, message: 'Fehler beim Hinzufügen des Menüs.', severity: 'error' });
  }
};


useEffect(() => {
  if (restaurants.length === 1 && selectedRestaurantId !== restaurants[0].id) {
    setSelectedRestaurantId(restaurants[0].id);
  }
}, [restaurants, selectedRestaurantId]);


  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchCategories(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  useEffect(() => {
  if (selectedRestaurantId) {
    fetchCategories(selectedRestaurantId);
    fetchMenus(selectedRestaurantId); // <= Neu hinzugefügt
  }
}, [selectedRestaurantId]);


  const colors = {
    primary: '#8B2E2E', accent: '#D4AF37', background: '#F5EFE6',
    text: '#3E3E3E', white: '#FFFFFF', border: '#D6CCC2'
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, py: 2 }}>
      <Container maxWidth="xs">


        
        <Paper elevation={4} sx={{ borderRadius: 4, p: isMobile ? 3 : 5, backgroundColor: colors.white }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

          </Box>

   {restaurants.length > 1 ? (
  <FormControl fullWidth sx={{ mb: 3 }}>
    <InputLabel>Restaurant auswählen</InputLabel>
    <Select
      value={selectedRestaurantId}
      label="Restaurant auswählen"
      onChange={(e) => {
        setSelectedRestaurantId(e.target.value);
        setShowAddForm(false);
      }}
      startAdornment={<StoreIcon sx={{ mr: 1, color: colors.accent }} />}
    >
      {restaurants.map((r) => (
        <MenuItem key={r.id} value={r.id}>
          {r.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
) : (
  <>
    {restaurants.length === 1 && selectedRestaurantId !== restaurants[0].id && (
      setSelectedRestaurantId(restaurants[0].id)
    )}
   <Box
  display="flex"
  alignItems="center"
  gap={2}
  bgcolor={colors.background} // z. B. "#f0f4f8"
  p={2}
  borderRadius={2}
  boxShadow={1}
  mb={3}
>
  <StoreIcon sx={{ fontSize: 40, color: colors.primary }} />
  <Box>
    <Typography variant="h6" color="textSecondary">
      Willkommen bei
    </Typography>
    <Typography variant="h5" fontWeight="bold" color={colors.primary}>
      {restaurants[0]?.name}
    </Typography>
  </Box>
</Box>
  </>
)}
       
{orderSummary && (
  <Box
    sx={{
      p: 3,
      mb: 3,
      backgroundColor: '#fffef8',
      border: '1px solid #e0e0e0',
      borderRadius: 3,
      boxShadow: 2,
    }}
  >
    <Box display="flex" alignItems="center" mb={2} gap={2}>
      <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 32 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          Bestellung läuft
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Deine Bestellung wird aktuell vorbereitet.
        </Typography>
      </Box>
    </Box>

    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        height: 12,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          backgroundColor: progress >= 100 ? 'green' : 'primary.main',
        },
      }}
    />

    <Box display="flex" justifyContent="space-between" mt={1}>
      <Typography variant="caption" color="text.secondary">
        {progress}% abgeschlossen
      </Typography>
      <Typography variant="caption" color="text.secondary">
        ⏳ {remainingMinutes} Min verbleibend
      </Typography>
    </Box>
  </Box>
)}

{showReadyMessage && (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.readyBg || '#e6ffe6',
        border: `1px solid ${colors.border || '#cce0cc'}`,
        borderRadius: 8
      }}
    >
      <Typography variant="h6" sx={{ color: colors.primaryText || 'green' }}>
        ✅ Deine Bestellung wird gleich geliefert!
      </Typography>
    </motion.div>
  </AnimatePresence>
)}


       {selectedRestaurantId && showAddForm && (
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            backgroundColor: '#fffef8',
            maxWidth: 500,
            mx: 'auto',
          }}
        >
          <Typography variant="h6" align="center" gutterBottom sx={{ color: colors.primary }}>
            Neue Kategorie erstellen
          </Typography>
          




          <Box display="flex" flexDirection="column" gap={3}>


          
      <TextField
        label="Name"
        fullWidth
        value={categoryForm.name}
        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
        error={!!formErrors.name}
        helperText={formErrors.name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CategoryIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Beschreibung"
        fullWidth
        multiline
        rows={3}
        value={categoryForm.description}
        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
        error={!!formErrors.description}
        helperText={formErrors.description}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth error={!!formErrors.sortOrder}>
        <InputLabel>Sortierreihenfolge</InputLabel>
        <Select
          value={categoryForm.sortOrder}
          label="Sortierreihenfolge"
          onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: parseInt(e.target.value) })}
          startAdornment={
            <InputAdornment position="start">
              <FiberManualRecordIcon sx={{ color: colors.accent, fontSize: 14 }} />
            </InputAdornment>
          }
        >
          {[...Array(10)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
        {formErrors.sortOrder && (
          <Typography variant="caption" color="error" sx={{ ml: 2 }}>{formErrors.sortOrder}</Typography>
        )}
      </FormControl>


          <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          onClick={() => setShowAddForm(false)}
          sx={{
            px: 4,
            py: 1.5,
            borderColor: colors.accent,
            color: colors.accent,
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': {
              borderColor: '#b89730',
              backgroundColor: '#fdf7e2',
            },
          }}
        >
          Abbrechen
        </Button>

        <Button
          variant="contained"
          onClick={handleCategorySubmit}
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: colors.accent,
            color: colors.white,
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#b89730' },
          }}
          startIcon={<AddIcon />}
        >
          Speichern
        </Button>
      </Box>

          </Box>
        </Paper>
      )}


          {selectedRestaurantId && !orderSummary && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>
                Kategorie auswählen
              </Typography>

        <List>



     <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel id="category-select-label"></InputLabel>
{/*<Select
  value={selectedCategoryId}
  onChange={(e) => setSelectedCategoryId(e.target.value)}
  displayEmpty
  fullWidth
  sx={{ mb: 3 }}
>
  <MenuItem value="" disabled>Kategorie auswählen</MenuItem>
  {categories.map((cat) => (
    <MenuItem key={cat.id} value={cat.id}>
      {cat.name}
    </MenuItem>
  ))}
</Select>
*/}
<Box
  sx={{
    display: 'flex',
    overflowX: 'auto',
    gap: 1.5,
    mb: 3,
    pb: 1,
    borderBottom: '1px solid #eee',
  }}
>

  {categories.map((cat) => (
    <Button
      key={cat.id}
      variant={selectedCategoryId === cat.id ? 'contained' : 'outlined'}
      onClick={() => setSelectedCategoryId(cat.id)}
      sx={{
        borderRadius: 20,
        whiteSpace: 'nowrap',
        fontSize: '0.75rem',
        px: 2,
        backgroundColor: selectedCategoryId === cat.id ? colors.primary : undefined,
        color: selectedCategoryId === cat.id ? 'white' : colors.primary,
        borderColor: colors.primary,
        textTransform: 'none',
        flexShrink: 0,
      }}
    >
      {cat.name}
    </Button>
  ))}
</Box>

{selectedCategoryId && (
  <Container>
    {menus
      .filter((cat) => cat.id === selectedCategoryId)
      .map((category, index) => (
        <Box key={index} sx={{ mb: 4 }}>
 {/*         <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
            {category.name}
          </Typography>
*/}
          {/* Menüitems */}
          {category.menuItems?.map((menü) => (
            <Paper key={menü.id} elevation={2} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, backgroundColor: colors.background }}>
              <Box display="flex" gap={1.5} alignItems="flex-start">
                {/* Bild */}
                {menü.image && (
                  <Box
                    component="img"
                    src={menü.image}
                    alt={menü.name}
                    sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }}
                     onClick={() => {
                       setSelectedMenüs(menü);
                        setSelectedOptions({});  
                       setAttributeDialogOpen(true);
        }}
                  />
                  
                )}

                {/* Infos */}
                <Box flex={1}>
                  <Typography variant="subtitle2" sx={{ color: colors.primary, fontWeight: 'bold', fontSize: '0.7rem' }}>
                    {menü.name}
                  </Typography>
                  <Box mt={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EuroIcon sx={{ fontSize: '0.9rem', color: colors.accent }} />
                      <Typography sx={{ fontSize: '0.7rem', color: colors.text }}>
                        Preis: {menü.price}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <DescriptionIcon sx={{ fontSize: '0.9rem', color: colors.accent }} />
                      <Typography sx={{ fontSize: '0.7rem', color: colors.text }}>
                        {menü.description || 'Keine Beschreibung'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}

          {/* Formular zum Hinzufügen */}
          {showAddMenuForm && (
            <Paper elevation={3} sx={{ mt: 4, p: 4, borderRadius: 3 }}>
              <Typography variant="h6" align="center" gutterBottom sx={{ color: colors.primary }}>
                Neues Menü erstellen
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: colors.accent }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Beschreibung"
                  multiline
                  rows={3}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon sx={{ color: colors.accent }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Preis"
                  value={menuForm.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                      setMenuForm({ ...menuForm, price: value });
                    }
                  }}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EuroIcon sx={{ color: colors.accent }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Bildauswahl */}
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const filename = file.name;
                        setMenuForm({ ...menuForm, image: `/images/${filename}` });
                      }
                    }}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<UploadFileIcon />}
                      sx={{ backgroundColor: colors.primary }}
                    >
                      Bild auswählen
                    </Button>
                  </label>
                </Box>

                {/* Aktionen */}
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button variant="outlined" onClick={() => setShowAddMenuForm(false)}>
                    Abbrechen
                  </Button>
                  <Button variant="contained" onClick={handleMenuSubmit} startIcon={<AddIcon />}>
                    Speichern
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      ))}
  </Container>
)}
</FormControl>
</List>




            </>
          )}
          
        </Paper>
      </Container>




  <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Kategorie bearbeiten</DialogTitle>
  <DialogContent dividers>
    <Box display="flex" flexDirection="column" gap={3} mt={1}>
      <TextField
        label="Name"
        fullWidth
        value={updatedCategory.name}
        onChange={(e) => setUpdatedCategory({ ...updatedCategory, name: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CategoryIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Beschreibung"
        fullWidth
        multiline
        rows={3}
        value={updatedCategory.description}
        onChange={(e) => setUpdatedCategory({ ...updatedCategory, description: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth>
        <InputLabel>Sortierreihenfolge</InputLabel>
        <Select
          value={updatedCategory.sortOrder}
          label="Sortierreihenfolge"
          onChange={(e) => setUpdatedCategory({ ...updatedCategory, sortOrder: parseInt(e.target.value) })}
          startAdornment={
            <InputAdornment position="start">
              <FormatListNumberedIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          }
        >
          {[...Array(10)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
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
<Dialog open={menuDialogOpen} onClose={() => setMenuDialogOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle
    sx={{
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    Menüs des Restaurants

  </DialogTitle>

  <DialogContent dividers>
    <Container>
      {menus.length === 0 ? (
        <Typography variant="body1">Keine Menüs verfügbar.</Typography>
      ) : (
        menus
          .filter(category => category.id === selectedCategoryId)
          .map((category, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
                {category.name}
              </Typography>

              {!showAddMenuForm &&
                category.menuItems?.map((item) => (
                                  <Paper
                  key={item.id}
                  elevation={2}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                    backgroundColor: colors.background,
                    width: '100%',
                    maxWidth: 500, // Optional: maximale Breite begrenzen
                  }}
                >
                                  <Box
                    display="flex"
                    gap={1.5}
                    flexDirection="row" // immer nebeneinander, auch mobil
                    alignItems="flex-start"
                  >
                                      {/* Bild */}
                                      {item.image && (
                                    <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 80,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          flexShrink: 0, // verhindert Verzerrung
                        }}
                        onClick={() => {
                          setSelectedMenüs(item);
                          setAttributeDialogOpen(true);
                        }}
      />

                      )}

                      {/* Textinformationen */}
                      <Box flex={1}>
                        {/* Menüname + Icons */}
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2" sx={{ color: colors.primary, fontWeight: 'bold',fontSize: '0.7rem'  }}>
                          {item.name}
                        </Typography>
                      </Box>

                        {/* Beschreibung & Preis */}
                        <Box mt={0.5}>



                          <Box display="flex" alignItems="center" gap={1}>
                            <EuroIcon sx={{ fontSize: '0.9rem', color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '0.7rem' }}>
                              Preis: {item.price}
                            </Typography>
                          </Box>

                               <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                    <DescriptionIcon sx={{ fontSize: '0.9rem', color: colors.accent }} />
                                    <Typography
                                      sx={{
                                        color: colors.text,
                                        fontSize: '0.7rem',
                                        overflowWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        flex: 1, // Damit es sich im flexbaren Bereich anpasst
                                      }}
                                    >
                                      {item.description || 'Keine Beschreibung'}
                                    </Typography>
                                  </Box>
                            </Box>

                        {/* ➕ Attribute und Optionen */}
                            <Box mt={1}>


        

                              {/* Snackbar als Rückmeldung */}
                              <Snackbar
                                open={copySuccess}
                                autoHideDuration={2000}
                                onClose={() => setCopySuccess(false)}
                                message="Attribute kopiert"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                              />
                            </Box>
                                </Box>
                    </Box>
                  </Paper>
                ))}

              {/* Add-Formular */}
              {selectedRestaurantId && showAddMenuForm && (
                <Paper
                  elevation={3}
                  sx={{
                    mt: 4,
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: '#fffef8',
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  <Typography variant="h6" align="center" gutterBottom sx={{ color: colors.primary }}>
                    Neues Menü erstellen
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={3}>
                    {/* Name */}
                    <TextField
                      label="Name"
                      fullWidth
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon sx={{ color: colors.accent }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Beschreibung */}
                    <TextField
                      label="Beschreibung"
                      fullWidth
                      multiline
                      rows={3}
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon sx={{ color: colors.accent }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Preis */}
                    <TextField
                      label="Preis"
                      fullWidth
                      required
                      value={menuForm.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                          setMenuForm({ ...menuForm, price: value });
                        }
                      }}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon sx={{ color: colors.accent }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Bild */}
                    <Box mt={2}>
                      <input
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const filename = file.name;
                            setMenuForm({ ...menuForm, image: `/images/${filename}` });
                          }
                        }}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<UploadFileIcon />}
                          sx={{ backgroundColor: colors.primary }}
                        >
                          Bild auswählen
                        </Button>
                      </label>
                    </Box>

                    {/* Aktionen */}
                    <Box display="flex" justifyContent="center" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowAddMenuForm(false)}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderColor: colors.accent,
                          color: colors.accent,
                          fontWeight: 'bold',
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: '#b89730',
                            backgroundColor: '#fdf7e2',
                          },
                        }}
                      >
                        Abbrechen
                      </Button>

                      <Button
                        variant="contained"
                        onClick={handleMenuSubmit}
                        sx={{
                          px: 4,
                          py: 1.5,
                          backgroundColor: colors.accent,
                          color: colors.white,
                          fontWeight: 'bold',
                          borderRadius: 2,
                          '&:hover': { backgroundColor: '#b89730' },
                        }}
                        startIcon={<AddIcon />}
                      >
                        Speichern
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          ))
      )}
    </Container>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setMenuDialogOpen(false)} color="primary">
      Schließen
    </Button>
  </DialogActions>
</Dialog>


<Dialog
  open={attributeDialogOpen}
  onClose={() => setAttributeDialogOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>
    {selectedMenüs?.name}
  </DialogTitle>

  <DialogContent dividers>
    {/* Bild oben */}
    {selectedMenüs?.image && (
      <Box
        component="img"
        src={selectedMenüs.image}
        alt={selectedMenüs.name}
        sx={{
          width: '100%',
          height: { xs: 180, sm: 240 },
          objectFit: 'cover',
          borderRadius: 2,
          mb: 2,
        }}
      />
    )}

    {/* Attribute */}
{selectedMenüs?.components?.length > 0 ? (
  <Box display="flex" flexDirection="column" gap={2}>
    {selectedMenüs.components.map((attribute) => {
      const options = attribute.options || [];

      return (
        <Box
          key={attribute.id}
          sx={{
            p: 2,
            border: `2px solid #800020`, // Bordo-Rahmen
            borderRadius: 2,
            backgroundColor: '#fffaf2', // leicht warmes Weiß
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: '#800020', mb: 1 }}
          >
            {attribute.name}{' '}
            <Typography
              variant="caption"
              component="span"
              sx={{ color: attribute.isRequired ? '#800020' : 'gray' }}
            >
              ({attribute.isRequired ? 'Pflicht' : 'Optional'})
            </Typography>
          </Typography>

          {options.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Keine Optionen verfügbar.
            </Typography>
          ) : options.length === 1 ? (
            <FormGroup sx={{ ml: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked
                    disabled
                    sx={{
                      padding: 0.5,
                      color: '#800020',
                      '&.Mui-checked': {
                        color: '#800020',
                      },
                      '&.Mui-disabled.Mui-checked': {
                        color: '#800020',
                      },
                      '&.Mui-disabled': {
                        color: '#800020',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    {options[0].name}
                    {parseFloat(options[0].priceChange) !== 0 && (
                      <span style={{ color: '#d4af37' }}>
                        {' '}
                        (+{options[0].priceChange} €)
                      </span>
                    )}
                  </Typography>
                }
              />
            </FormGroup>
          ) : (



// für RadioGroup

<FormGroup>
  {options.map((option) => {
    const currentSelections = selectedOptions[attribute.id] || [];

    const isChecked = currentSelections.some((sel) => sel.optionId === option.id);

    const handleChange = (e) => {
      const isSelected = e.target.checked;
      let updatedSelections;

      if (isSelected) {
        if (currentSelections.length < 2) {
          updatedSelections = [
            ...currentSelections,
            {
              value: attribute.name,
              optionId: option.id,
              optionName: option.name,
            },
          ];
        } else {
          updatedSelections = currentSelections; // Nicht mehr als 2 zulassen
        }
      } else {
        updatedSelections = currentSelections.filter(
          (sel) => sel.optionId !== option.id
        );
      }

      setSelectedOptions((prev) => ({
        ...prev,
        [attribute.id]: updatedSelections,
      }));
    };

    return (
      <FormControlLabel
        key={option.id}
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
            sx={{
              padding: 0.5,
              color: '#800020',
              '&.Mui-checked': {
                color: '#800020',
              },
            }}
          />
        }
        label={
          <Typography variant="body2">
            {option.name}
            {parseFloat(option.priceChange) !== 0 && (
              <span style={{ color: '#d4af37' }}>
                {' '} (+{option.priceChange} €)
              </span>
            )}
          </Typography>
        }
      />
    );
  })}
</FormGroup>





//Für Checkbox




 

          )}
        </Box>
      );
    })}
  </Box>
) : (
  <Typography variant="body2" color="text.secondary">
    Keine Attribute vorhanden.
  </Typography>
)}

  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button onClick={handleClose} variant="outlined" color="primary">
        ABBRECHEN
      </Button>

      <Button onClick={handleAddToCart} variant="contained" color="primary">
        HINZUFÜGEN
      </Button>
    </Box>
  </DialogActions>
</Dialog>


  <Dialog open={editDialogMenuOpen} onClose={() => setEditDialogMenuOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Menu bearbeiten</DialogTitle>
  <DialogContent dividers>
    <Box display="flex" flexDirection="column" gap={3} mt={1}>
    <TextField
  label="Name"
  fullWidth
  required
  value={updatedMenu.name}
  onChange={(e) => setUpdatedMenu({ ...updatedMenu, name: e.target.value })}
  error={!updatedMenu.name}
  helperText={!updatedMenu.name ? 'Pflichtfeld' : ''}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <CategoryIcon sx={{ color: colors.accent }} />
      </InputAdornment>
    ),
  }}
/>

<TextField
  label="Beschreibung"
  fullWidth
  required
  multiline
  rows={3}
  value={updatedMenu.description}
  onChange={(e) => setUpdatedMenu({ ...updatedMenu, description: e.target.value })}
  error={!updatedMenu.description}
  helperText={!updatedMenu.description ? 'Pflichtfeld' : ''}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <DescriptionIcon sx={{ color: colors.accent }} />
      </InputAdornment>
    ),
  }}
/>

<TextField
  label="Preis"
  fullWidth
  required
  value={updatedMenu.price}
  onChange={(e) => {
    const value = e.target.value;
    // Erlaubt nur Zahlen mit optionalem Dezimalpunkt (z.B. 12, 12.5, 0.99)
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setUpdatedMenu({ ...updatedMenu, price: value });
    }
  }}
  error={!updatedMenu.price}
  helperText={!updatedMenu.price ? 'Pflichtfeld' : ''}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EuroIcon sx={{ color: colors.accent }} />
      </InputAdornment>
    ),
  }}
/>





<Box mt={2}>
  <input
    type="file"
    accept="image/*"
    id="image-upload"
    style={{ display: 'none' }}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        const filename = file.name;
        setMenuForm({ ...menuForm, image: `/images/${filename}` });
      }
    }}
  />
  <label htmlFor="image-upload">
    <Button
      variant="contained"
      component="span"
      startIcon={<UploadFileIcon />}
      sx={{ backgroundColor: colors.primary }}
    >
      Bild ändern
    </Button>
  </label>
</Box>



    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditDialogMenuOpen(false)} color="secondary">
      Abbrechen
    </Button>
 
   

        <Button
          onClick={handleUpdateMenu}
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

<Dialog
  open={cartDialogOpen}
  onClose={() => setCartDialogOpen(false)}
  fullWidth
  maxWidth="md"
>
  <DialogTitle>Warenkorb</DialogTitle>
  <DialogContent dividers>
    {cartItems.length === 0 ? (
      <Typography>Warenkorb ist leer.</Typography>
    ) : (
      cartItems.map((item, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1">Menü ID: {item.menuItemId}</Typography>
          <Typography variant="body2">Anzahl: {item.quantity}</Typography>
          {item.components.map((comp, i) => (
            <Typography key={i} variant="body2">
              - {comp.value} (OptionID: {comp.optionId})
            </Typography>
          ))}
        </Paper>
      ))
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setCartDialogOpen(false)} color="secondary">
      Schließen
    </Button>
    <Button
      onClick={handleSubmitOrder}
      color="primary"
      variant="contained"
      disabled={cartItems.length === 0}
    >
      Bestellen
    </Button>
  </DialogActions>
</Dialog>


{/*
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ zIndex: 1300 }}>
      <DialogTitle
        sx={{
          backgroundColor: '#800020',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 22,
          textAlign: 'center',
          py: 2,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        🛒 Ihr Warenkorb
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#fffaf2', p: 3 }}>
        {cartItems.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary">
            Ihr Warenkorb ist leer.
          </Typography>
        ) : (
          <Box>
            {cartItems.map((item, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #eee',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Typography fontWeight="bold" fontSize={16}>
                      {item.menuName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    {item.components?.length > 0 && (
                      <Box mt={1}>
                        {item.components.map((c, idx) => (
                          <Typography variant="body2" key={idx} sx={{ color: '#800020' }}>
                            • {c.value}: <span style={{ color: '#d4af37' }}>{c.optionName}</span>
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} ml={2}>
                    <Tooltip title="Entfernen">
                      <IconButton
                        size="small"
                        onClick={() => handleRemove(index)}
                        sx={{ color: '#800020' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}
                      sx={{ color: '#800020' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      sx={{ color: '#800020' }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Typography fontWeight="bold">
                    {(item.price * item.quantity).toFixed(2)} <EuroIcon sx={{ fontSize: 16 }} />
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </DialogContent>

      <Box
        sx={{
          backgroundColor: '#fffaf2',
          px: 3,
          py: 2,
          borderTop: '1px solid #eee',
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Zwischensumme:</Typography>
          <Typography fontWeight="bold" color="#800020">
            {total.toFixed(2)} €
          </Typography>
        </Box>
      </Box>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Zurück
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#800020',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#a0002a',
            },
          }}
          fullWidth
        >
          Zur Kasse
        </Button>
      </DialogActions>
    </Dialog>
  
    */}

      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.severity}>{feedback.message}</Alert>
      </Snackbar>
    </Box>
  );
}
