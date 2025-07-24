import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider, useTheme, useMediaQuery,
  InputAdornment, IconButton, List, ListItem, ListItemText, ListItemIcon,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select,
  FormControl, InputLabel, Snackbar, Alert,DialogContentText 
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

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
import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';


const RESTAURANT_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/restaurants';
const CATEGORY_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/categories';
const Menu_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/items';
const Attribut_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components';
const Options_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components/options';



export default function Restaurant() {
  const [addAttributOpen, setAddAttributOpen] = useState(false);
  const [attributeName, setAttributeName] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [attributeType, setAttributeType] = useState('SELECT');
  const [optionPrice, setOptionPrice] = useState('');
  const [options, setOptions] = useState([]);
  const [editAttributeDialogOpen, setEditAttributeDialogOpen] = useState(false);
  const [attributeId, setAttributeId] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
const [deleteOptionDialogOpen, setDeleteOptionDialogOpen] = useState(false);
const [optionToDelete, setOptionToDelete] = useState(null);

const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
const [categoryToDelete, setCategoryToDelete] = useState(null);

const [deleteMenüDialogOpen, setDeleteMenüDialogOpen] = useState(false);
const [MenüToDelete, setMenüToDelete] = useState(null);


const [selectedAttribute, setSelectedAttribute] = useState(null); // oder: useState<AttributeType | null>(null);
const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [categories, setCategories] = useState([]);
  const [menüId, setMenüId] = useState('');
  const [restaurantId, setRestaurantId] = useState(''); 
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
const [selectedCategoryId, setSelectedCategoryId] = useState(null);
const [menuDialogOpen, setMenuDialogOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null); // für Bearbeiten
const [editDialogOpen, setEditDialogOpen] = useState(false);
  const theme = useTheme();
  const [copiedAttributes, setCopiedAttributes] = useState([]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
const [copySuccess, setCopySuccess] = useState(false);
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(RESTAURANT_API);
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async (restaurantId) => {
    try {
      const res = await axios.get(`${CATEGORY_API}/restaurant/${restaurantId}`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

const fetchMenus = async (restaurantId) => {
  try {
    const res = await axios.get(`${RESTAURANT_API}/${restaurantId}/menu`);
    setMenus(res.data.categories); // Speichere komplette Menüstruktur (mit Kategorien + MenüItems)
  } catch (err) {
    console.error('Fehler beim Laden der Menüs:', err);
  }
};

const fetchAttribute = async (restaurantId) => {
  try {
    const res = await axios.get(`${RESTAURANT_API}/${restaurantId}/menu`);
    setAttribute(res.data.categories); // Speichere komplette Menüstruktur (mit Kategorien + MenüItems)
  } catch (err) {
    console.error('Fehler beim Laden der Menüs:', err);
  }
};

const handleAskDeleteOption = (optionId) => {
  setOptionToDelete(optionId);
  setDeleteOptionDialogOpen(true);
};

const handleAskDeleteMenü = (menüId) => {
  setMenüToDelete(menüId);
  setDeleteMenüDialogOpen(true);
};

const handleAskDeleteCategory = (CategoryId, RestaurantId) => {
  setCategoryToDelete(CategoryId);
  setRestaurantId(RestaurantId);
  setDeleteCategoryDialogOpen(true);
  


};

const handleOpen = () => setAddAttributOpen(true);
 const handleClose = () => {
    setAddAttributOpen(false);
    setAttributeName('');
    setIsRequired(false);
    setOptionName('');
    setOptionPrice('');
    setOptions([]);
  };

   const handleAddOption = () => {
    if (!optionName) return;
    setOptions([...options, { name: optionName, priceChange: parseFloat(optionPrice || '0') }]);
    setOptionName('');
    setOptionPrice('');
  };

const handleDeleteAttribute = async () => {
  try {
   await axios.delete(Attribut_API + '/' + attributeId);


    setEditAttributeDialogOpen(false);
    // Optional: Refresh Menu Item or fetch updated attributes
    fetchMenus(restaurantId);
  } catch (error) {
    console.error('Fehler beim Löschen des Attributs:', error);
  }
};

{/*
const handleEditOption = (index) => {
  const option = selectedAttribute.options.id===index;
  setOptionName(option.name);
  setOptionPrice(option.priceChange);
  setEditingOptionIndex(index); // Definiere vorher mit: const [editingOptionIndex, setEditingOptionIndex] = useState(null);
};
*/}


//Muss ich nich anpassen für das Updaten von Attrivute und vielleicht Optioenn
const handleEditOption = async (optionId) => {
  try {

  await axios.patch(Options_API + '/' + optionId);

    // Lokale Aktualisierung: entferne Option aus selectedAttribute
    const updatedOptions = selectedAttribute.options.filter((opt) => opt.id !== optionId);
    setSelectedAttribute({ ...selectedAttribute, options: updatedOptions });
  } catch (error) {
    console.error('Fehler beim Löschen der Option:', error);
  }
};

const handleDeleteOption = async (optionId) => {
  try {

  await axios.delete(Options_API + '/' + optionId);

    // Lokale Aktualisierung: entferne Option aus selectedAttribute
    const updatedOptions = selectedAttribute.options.filter((opt) => opt.id !== optionId);
    setSelectedAttribute({ ...selectedAttribute, options: updatedOptions });
  } catch (error) {
    console.error('Fehler beim Löschen der Option:', error);
  }
};


const handleConfirmDelete = async () => {
  try {
    await axios.delete(`${Options_API}/${optionToDelete}`);

    // Option lokal entfernen
    const updatedOptions = selectedAttribute.options.filter((opt) => opt.id !== optionToDelete);
    setSelectedAttribute({ ...selectedAttribute, options: updatedOptions });

    setSnackbar({ open: true, message: 'Option erfolgreich gelöscht', severity: 'success' });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    setSnackbar({ open: true, message: 'Fehler beim Löschen', severity: 'error' });
  } finally {
    setDeleteOptionDialogOpen(false);
    setOptionToDelete(null);
  }
};


const handleUpdateAttribute = async () => {
  if (!selectedAttribute) return;

  try {
    await axios.put(Attribut_API/selectedAttribute.id, {
      name: attributeName,
      type: attributeType,
      isRequired,
    });

    setEditAttributeDialogOpen(false);
    // Optional: neu laden
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Attributs:', error);
  }
};

{/*
const handleSave = async () => {
  try {
    // 1. Attribut anlegen
    const attrRes = await axios.post(Attribut_API, {
      name: attributeName,
      type: attributeType,        // z. B. "SELECT" oder "MULTISELECT"
      isRequired: isRequired,     // boolean
      menuItemId: menüId     // ID des aktuellen Menü-Items
    });

    const createdAttribute = attrRes.data;

    // 2. Optionen speichern (nacheinander mit attributeId)
    for (const option of options) {
      await axios.post(Options_API, {
        name: option.name,
        priceChange: option.priceChange,
        attributeId: createdAttribute.id
      });
    }

    // Erfolgreich → Dialog schließen und ggf. neu laden
    handleClose();
    //onAttributeAdded?.(); // optionaler Callback
    fetchMenus(restaurantId);
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
  }
};

*/}

const handleSaveNewAttribut = async () => {
  try {
    const attrRes = await axios.post(Attribut_API, {
      name: attributeName,
      type: attributeType,
      isRequired: isRequired,
      menuItemId: menüId
    });

    const createdAttribute = attrRes.data;

    // Optionen speichern
    const createdOptions = [];
    for (const option of options) {
      const res = await axios.post(Options_API, {
        name: option.name,
        priceChange: option.priceChange,
        componentId: createdAttribute.id
      });
      createdOptions.push(res.data);
    }

    // Menü lokal aktualisieren
    setMenus((prevMenus) =>
      prevMenus.map((menu) => ({
        ...menu,
        menuItems: menu.menuItems.map((item) => {
          if (item.id === menüId) {
            return {
              ...item,
              components: [...(item.components || []), {
                ...createdAttribute,
                options: createdOptions
              }]
            };
          }
          return item;
        }),
      }))
    );

    handleClose();
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
  }
};

const handleToggleStatus = async (restaurant) => {
  try {
    if (restaurant.isActive) {
      // Deaktivieren
 //     await axios.delete(`${API_URL}/${restaurant.id}`);
  //    showFeedback('Restaurant wurde deaktiviert.', 'info');
    } else {
      // Reaktivieren
     // await axios.patch(`${API_URL}/${restaurant.id}/reactivate`);
   //   showFeedback('Restaurant wurde reaktiviert.', 'success');
    }

    fetchCategories();
  } catch (error) {
    console.error('Fehler beim Umschalten des Status:', error);
  //  showFeedback('Statusänderung fehlgeschlagen.', 'error');
  }
};

const handleCopyAttributes = (attributes: any[]) => {
  setCopiedAttributes(attributes);
  setCopySuccess(true);
};


const handleAddCopiedAttributes = async (menuItemId: string,restaurantId) => {
  if (!copiedAttributes || copiedAttributes.length === 0) return;

  for (const attr of copiedAttributes) {
    const { data: createdAttribute } = await axios.post(Attribut_API, {
      name: attr.name,
      type: attr.type,
      isRequired: attr.isRequired,
      menuItemId: menuItemId,
    });

    const attributeId = createdAttribute.id;

    if (attr.options?.length > 0) {
      for (const opt of attr.options) {
        await axios.post(Options_API, {
          name: opt.name,
          priceChange: opt.priceChange,
          componentId: attributeId,
        });
      }
    }
  }

 // enqueueSnackbar('Attribute eingefügt', { variant: 'success' });

  // Optional: Neu laden
  fetchMenus(restaurantId); // oder fetchData(), je nach App-Struktur
};



const handleConfirmDeleteCategory = async () => {


  try {
    await axios.delete(`${CATEGORY_API}/${categoryToDelete}`);
    fetchCategories(restaurantId);
   setSnackbar({ open: true, message: 'Category erfolgreich gelöscht', severity: 'success' });
  } catch (error) {
    setSnackbar({ open: true, message: 'Fehler beim Löschen', severity: 'error' });
  }finally {
    setDeleteCategoryDialogOpen(false);
  }
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





const handleAdd = async () => {

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
    await axios.post(CATEGORY_API, payload);
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

const handleEdit = (item) => {
  // Öffne z. B. ein Bearbeiten-Dialog
  setSelectedItem(item);
  setEditDialogOpen(true);
};

const handleDeleteMenu = async () => {

    try {


      await axios.delete(`${Menu_API}/${MenüToDelete}`);

      // Menü neu laden oder aus local state entfernen
      setMenus((prev) =>
        prev.map((cat) => ({
          ...cat,
          menuItems: cat.menuItems.filter((item) => item.id !== MenüToDelete),
        }))
      );
      setSnackbar({ open: true, message: 'Menü erfolgreich gelöscht', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Fehler beim Löschen', severity: 'error' });
    //  alert('Löschen fehlgeschlagen.');
    }finally {
    setDeleteMenüDialogOpen(false);
    setMenüToDelete(null);
  }
  
};

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
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background, py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ borderRadius: 4, p: isMobile ? 3 : 5, backgroundColor: colors.white }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" color={colors.primary}>
              Kategorien verwalten
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: colors.primary, color: colors.white, '&:hover': { backgroundColor: colors.accent } }}
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={!selectedRestaurantId}
            >
              Kategorie hinzufügen
            </Button>
          </Box>

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


          {selectedRestaurantId && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>
                Kategorien auswählen
              </Typography>

        <List>
   

          {categories.map((cat) => (
            <ListItem
              key={cat.id}
              alignItems="flex-start"
              divider

              button
              onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setMenuDialogOpen(true);
                }}

              selected={selectedCategoryId === cat.id}
              secondaryAction={
                <Box display="flex" alignItems="center" gap={1}>
                  {/* Status Switch */}
                  <Switch
                    checked={cat.isActive}
                    onChange={() => handleToggleStatus(cat)}
                    color="success"
                  />

                  {/* Edit Button nur wenn aktiv */}
                  {cat.isActive && (
                <IconButton
                  onClick={() => {
                    setUpdatedCategory({
                      id: cat.id,
                      name: cat.name,
                      description: cat.description,
                      sortOrder: cat.sortOrder || 1
                    });
                    setEditDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>

                          )}

          {/* Delete Button immer sichtbar */}
       <IconButton
  edge="end"
  aria-label="löschen"
  onClick={(e) => {
    e.stopPropagation(); // verhindert das Öffnen der Kategorie
    handleAskDeleteCategory(cat.id, cat.restaurantId);
  }}
>
  <DeleteIcon color="error" />
</IconButton>

        </Box>
      }
    >
      <ListItemIcon sx={{ mt: 0.5 }}>
        <RestaurantIcon sx={{ color: colors.primary }} />
      </ListItemIcon>

      <ListItemText
        primary={
          <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 'bold' }}>
            {cat.name}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 1 }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <DescriptionIcon sx={{ fontSize: 18, color: colors.accent }} />
              <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                {cat.description || 'Keine Beschreibung'}
              </Typography>
            </Box>
{/*
            <Box display="flex" alignItems="center" gap={1}>
              <FiberManualRecordIcon sx={{ fontSize: 14, color: colors.accent }} />
              <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                Sortierung: {cat.sortOrder}
              </Typography>
            </Box>
*/}
          </Box>
        }
      />
    </ListItem>
  ))}
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

<Dialog open={menuDialogOpen} onClose={() => setMenuDialogOpen(false)} fullWidth maxWidth="lg">
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
<Button
  variant="contained"
  startIcon={<AddIcon />}
  color="error"
  onClick={() => setShowAddMenuForm(!showAddMenuForm)}
  disabled={!selectedRestaurantId}
>
  Neues Menü
</Button>

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
                    elevation={3}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: colors.background,
                    }}
                  >
                    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                      {/* Bild */}
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: { xs: '100%', sm: 160 },
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 2,
                          }}
                        />
                      )}

                      {/* Textinformationen */}
                      <Box flex={1}>
                        {/* Menüname + Icons */}
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>

                          <Box>
                            <Tooltip title="Bearbeiten">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setUpdatedMenu({
                                    id: item.id,
                                    name: item.name,
                                    description: item.description,
                                    price: item.price,
                                    restaurantId: category.restaurantId,
                                    image: item.image
                                  });
                                  setEditDialogMenuOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" sx={{ color: colors.primary }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Löschen">
                              <IconButton
                                size="small"
                                onClick={() => handleAskDeleteMenü(item.id)}
                              >
                             {/*   <DeleteIcon fontSize="small" sx={{ color: colors.primary }} />  */}

                                 <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Beschreibung & Preis */}
                        <Box mt={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <DescriptionIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                              {item.description || 'Keine Beschreibung'}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <EuroIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                              Preis: {item.price}
                            </Typography>
                          </Box>
                        </Box>

                        {/* ➕ Attribute und Optionen */}
                            <Box mt={1}>
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                             <Box display="flex" alignItems="center" mb={1}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: 'bold', color: colors.primary, mr: 1 }}
                                >
                                  Beilagen
                                </Typography>
                            <Tooltip title="Neue Attribute">
                              <IconButton
                                size="small"
                              onClick={() => {
                                      handleOpen();
                                      setMenüId(item.id);
                                      setRestaurantId(category.restaurantId);
                                    }}

                                sx={{
                                  backgroundColor: colors.accent,
                                  color: 'white',
                                  ml: 1,
                                  p: 0.5,
                                  borderRadius: '8px',
                                  '&:hover': {
                                    backgroundColor: colors.accentDark || '#b89730',
                                  },
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                              >
                                <AddIcon fontSize="small" sx={{ fontSize: 16 }} />
                              </IconButton>
                              </Tooltip>
                                   {item.components?.length > 0 && (
                                  <Tooltip title="Attribute kopieren">
                                    <IconButton size="small" onClick={() => handleCopyAttributes(item.components)}>
                                      <ContentCopyIcon sx={{ color: colors.accent }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                   {item.components?.length === 0 && copiedAttributes.length > 0 && (
                                      <Tooltip title="Kopierte Attribute hinzufügen">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleAddCopiedAttributes(item.id, category.restaurantId)}
                                        >
                                          <ContentPasteIcon sx={{ color: colors.accent }} />
                                        </IconButton>
                                      </Tooltip>
                                    )}



                                    </Box>

                           
                               </Box>

                              {item.components?.length > 0 ? (
                                <Box display="flex" flexWrap="wrap" gap={3}>
                                  {item.components.map((attribute) => (
                                    <Box
                                      key={attribute.id}
                                      sx={{
                                        minWidth: 100,
                                        p: 2,
                                        border: `1px solid ${colors.accent}`,
                                        borderRadius: 2,
                                        backgroundColor: '#fffefc',
                                      }}
                                    >
                                       <Box display="flex" alignItems="center" mb={1}>
                                      <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {attribute.name} {attribute.isRequired ? '(Pflicht)' : '(Optional)'}

                                      </Typography>
                                      
                             <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedAttribute(attribute); // z. B. { id, name, type, isRequired, options }
                                setEditAttributeDialogOpen(true);
                                setAttributeId(attribute.id);
                                setRestaurantId(category.restaurantId);
                              }}
                              sx={{
                                backgroundColor: colors.accent,
                                color: 'white',
                                ml: 1,
                                p: 0.5,
                                borderRadius: '8px',
                                '&:hover': {
                                  backgroundColor: colors.accentDark || '#b89730',
                                },
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                            >
                              <EditIcon fontSize="small" sx={{ fontSize: 16 }} />
                            </IconButton>

                                      </Box>
                                      {attribute.options?.length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                          {attribute.options.map((option) => (
                                            <li key={option.id}>
                                              <Typography variant="body2">
                                                {option.name}
                                                {parseFloat(option.priceChange) !== 0 && (
                                                  <> (+{option.priceChange} €)</>
                                                )}
                                              </Typography>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <Typography variant="body2" color="text.secondary">
                                          Keine Optionen verfügbar.
                                        </Typography>
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2" sx={{ color: colors.text }}>
                                  Keine Attribute vorhanden.
                                </Typography>
                              )}

                              {/* Snackbar als Rückmeldung */}
                              <Snackbar
                                open={copySuccess}
                                autoHideDuration={2000}
                                onClose={() => setCopySuccess(false)}
                                message="Attribute kopiert"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                              />

                              <Snackbar
                                open={snackbar.open}
                                autoHideDuration={3000}
                                onClose={() => setSnackbar({ ...snackbar, open: false })}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                              >
                                <Alert
                                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                                  severity={snackbar.severity}
                                  sx={{ width: '100%' }}
                                >
                                  {snackbar.message}
                                </Alert>
                              </Snackbar>

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
  open={deleteMenüDialogOpen}
  onClose={() => setDeleteMenüDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>
    <Box display="flex" alignItems="center" gap={1}>
      <DeleteIcon color="error" />
      <Typography variant="h6" color="error">
        Menü löschen
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
      Möchten Löschen?
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setDeleteMenüDialogOpen(false)} variant="outlined">
      Abbrechen
    </Button>
    <Button onClick={handleDeleteMenu} variant="contained" color="error">
      Löschen
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={editAttributeDialogOpen} onClose={() => setEditAttributeDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    Attribut bearbeiten
<Tooltip title="Attribut löschen">
  <Button
    variant="contained"
    startIcon={<DeleteIcon />}
    color="error"
    onClick={handleDeleteAttribute}
  >
    Attribut löschen
  </Button>
</Tooltip>

  </DialogTitle>

  <DialogContent dividers>
    <TextField
      label="Name"
      fullWidth
      value={selectedAttribute?.name || ''}
      onChange={(e) =>
        setSelectedAttribute({ ...selectedAttribute, name: e.target.value })
      }
      sx={{ mb: 2 }}
    />

    {/* Typ */}
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel id="edit-type-label">Typ</InputLabel>
      <Select
        labelId="edit-type-label"
        value={selectedAttribute?.type || ''}
        label="Typ"
        onChange={(e) =>
          setSelectedAttribute({ ...selectedAttribute, type: e.target.value })
        }
      >
        <MenuItem value="SELECT">SELECT</MenuItem>
        <MenuItem value="MULTISELECT">MULTISELECT</MenuItem>
      </Select>
    </FormControl>

    {/* Pflichtfeld */}
    <FormControl fullWidth>
      <InputLabel id="edit-required-label">Pflichtfeld</InputLabel>
      <Select
        labelId="edit-required-label"
        value={selectedAttribute?.isRequired ? 'true' : 'false'}
        onChange={(e) =>
          setSelectedAttribute({ ...selectedAttribute, isRequired: e.target.value === 'true' })
        }
        label="Pflichtfeld"
      >
        <MenuItem value="true">Ja</MenuItem>
        <MenuItem value="false">Nein</MenuItem>
      </Select>
    </FormControl>

    {/* Optionen anzeigen und bearbeiten */}
    <Box mt={3}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Optionen
      </Typography>
      <List>
        {selectedAttribute?.options?.map((opt, index) => (
          <ListItem key={opt.id} divider>
            <ListItemText primary={opt.name} secondary={`+${opt.priceChange} €`} />
            <ListItemSecondaryAction>
         
              <Tooltip title="Option bearbeiten">
                <IconButton onClick={() => handleEditOption(opt.id)}>
             
                   <EditIcon sx={{ color: colors.primary }} />
                </IconButton>
              </Tooltip>
        
              <Tooltip title="Löschen">
                <IconButton onClick={() => handleAskDeleteOption(opt.id)}>
           
                   <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditAttributeDialogOpen(false)}>Abbrechen</Button>
    <Button variant="contained" onClick={handleUpdateAttribute} sx={{ backgroundColor: colors.accent }}>
      Speichern
    </Button>
  </DialogActions>
</Dialog>



<Dialog
  open={deleteOptionDialogOpen}
  onClose={() => setDeleteOptionDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>
    <Box display="flex" alignItems="center" gap={1}>
      <DeleteIcon color="error" />
      <Typography variant="h6" color="error">
        Option löschen
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
      Option löschen?
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setDeleteOptionDialogOpen(false)} variant="outlined">
      Abbrechen
    </Button>
    <Button onClick={handleConfirmDelete} variant="contained" color="error">
      Löschen
    </Button>
  </DialogActions>
</Dialog>


<Dialog
  open={deleteCategoryDialogOpen}
  onClose={() => setDeleteCategoryDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>
    <Box display="flex" alignItems="center" gap={1}>
      <DeleteIcon color="error" />
      <Typography variant="h6" color="error">
        Category löschen
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
     Category löschen?
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setDeleteCategoryDialogOpen(false)} variant="outlined">
      Abbrechen
    </Button>
    <Button onClick={handleConfirmDeleteCategory} variant="contained" color="error">
      Löschen
    </Button>
  </DialogActions>
</Dialog>

<Dialog open={addAttributOpen} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    Attribut hinzufügen
  </DialogTitle>

  <DialogContent dividers>
    <Paper
      elevation={3}
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        backgroundColor: '#fffef8',
      }}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Attribut-Name */}
        <TextField
          label="Name des Attributs"
          fullWidth
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
        />

        {/* Typ-Auswahl */}
        <FormControl fullWidth>
          <InputLabel id="type-label">Typ</InputLabel>
          <Select
            labelId="type-label"
            value={attributeType}
            onChange={(e) => setAttributeType(e.target.value)}
            label="Typ"
          >
            <MenuItem value="SELECT">SELECT</MenuItem>
            <MenuItem value="MULTISELECT">MULTI_SELECT</MenuItem>
            <MenuItem value="MULTISELECT">TEXT</MenuItem>
            <MenuItem value="MULTISELECT">NUMBER</MenuItem>

          </Select>
        </FormControl>

        {/* Pflichtfeld */}
        <FormControl fullWidth>
          <InputLabel id="required-label">Muss gewählt werden?</InputLabel>
          <Select
            labelId="required-label"
            value={isRequired}
            onChange={(e) => setIsRequired(e.target.value === 'true')}
            label="Pflichtfeld"
          >
            <MenuItem value="true">Ja</MenuItem>
            <MenuItem value="false">Nein</MenuItem>
          </Select>
        </FormControl>

        {/* Option hinzufügen */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Name Option"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            
          />
          <TextField
            label="Preis (€)"
            type="number"
            value={optionPrice}
            onChange={(e) => setOptionPrice(e.target.value)}
            sx={{ width: 150 }}
          />
          <Button
            variant="contained"
            onClick={handleAddOption}
            sx={{
              backgroundColor: colors.accent,
              color: colors.white,
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: colors.accentDark || '#b89730',
              },
            }}
          >
            Hinzufügen
          </Button>
        </Box>

        {/* Liste der Optionen */}
        <List>
          {options.map((opt, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={opt.name}
                secondary={`+${opt.priceChange.toFixed(2)} €`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDeleteOption(index)}>
                  <DeleteIcon sx={{ color: colors.error }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={handleClose}
      variant="outlined"
      sx={{
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
      onClick={handleSaveNewAttribut}
      variant="contained"
      sx={{
        backgroundColor: colors.accent,
        color: colors.white,
        fontWeight: 'bold',
        borderRadius: 2,
        '&:hover': { backgroundColor: '#b89730' },
      }}
    >
      Speichern
    </Button>
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
