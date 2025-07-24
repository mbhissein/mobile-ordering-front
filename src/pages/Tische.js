import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider, useTheme, useMediaQuery,
  InputAdornment, IconButton, List, ListItem, ListItemText, ListItemIcon,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select,
  FormControl, InputLabel, Snackbar, Alert,DialogContentText 
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import TableChartSharpIcon from '@mui/icons-material/TableChartSharp';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CategoryIcon from '@mui/icons-material/Category';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Switch from '@mui/material/Switch';
import { Card, CardContent } from '@mui/material';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import Tooltip from '@mui/material/Tooltip';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import API_BASE_URL from '../config'; // oder './config', je nach Struktur
import OrderSummaryDialog from '../components/OrderSummaryDialog';

import { Menu } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EuroIcon from '@mui/icons-material/Euro'; // oder ein passendes Preis-Icon





const RESTAURANT_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/restaurants';
const CATEGORY_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/categories';
const Menu_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/items';
const Options_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/menu/components/options';
const Tables_API = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/tables';
const Order_API_BASE = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/orders';



export default function Restaurant(setOrderSummary) {
const [menuDialogOpen, setMenuDialogOpen] = useState(false);
const [clickedTable, setClickedTable] = useState(null);
const [anchorEl, setAnchorEl] = useState(null);
const [tableIdForOrder, setTableIdForOrder] = useState(null);
const [tabelOrder, setTabelOrder] = useState('');
const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const [optionName, setOptionName] = useState('');

  const [optionPrice, setOptionPrice] = useState('');
  const [options, setOptions] = useState([]);


  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

const [deleteTableDialogOpen, setDeleteTableDialogOpen] = useState(false);
const [tableToDelete, setTableToDelete] = useState(null);



const [selectedAttribute, setSelectedAttribute] = useState(null); // oder: useState<AttributeType | null>(null);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [categories, setCategories] = useState([]);
   const [tables, setTables] = useState([]);
  const [restaurantId, setRestaurantId] = useState(''); 
  const [newTableForm, setNewTableForm] = useState({
    tableNumber: '',
    capacity: '',
    isActive: true,

  });

    const [menuForm, setMenuForm] = useState({ 
      name: '', 
      description: '', 
      price: '',
      image: ''
    });

  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [showAddForm, setShowAddForm] = useState(false);
const [formErrors, setFormErrors] = useState({});
const [updatedTable, setUpdatedTable] = useState({
  id: '',
  tableNumber: '',
  isActive: '',
  capacity: '',
  restaurantId: '',

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


const [selectedTableId, setSelectedTableId] = useState(null);

const [editDialogOpen, setEditDialogOpen] = useState(false);
  const theme = useTheme();


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

useEffect(() => {
  const fetchTableOrder = async () => {
    if (tableIdForOrder === null) return;

    try {
      const response = await axios.get(`${Order_API_BASE}/table/${tableIdForOrder}/current`);

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const orders = response.data.data;

        // Nimm nur die erste Bestellung mit Status 'PLACED'
        const placedOrder = orders.find(order => order.status === 'PLACED');

        if (placedOrder) {
          const summary = {
            orderId: placedOrder.id,
            status: placedOrder.status,
            orderNumber: placedOrder.orderNumber,
            customerName: placedOrder.customerName,
            customerPhone: placedOrder.customerPhone,
            specialInstructions: placedOrder.specialInstructions,
            subtotal: placedOrder.subtotal,
            tax: placedOrder.tax,
            total: placedOrder.total,
            placedAt: placedOrder.placedAt,
            tableId: placedOrder.tableId,
            items: placedOrder.orderItems.map(item => ({
              name: item.menuItem.name,
              quantity: item.quantity,
              total: item.totalPrice,
              notes: item.specialNotes,
              components: item.components?.map(c => ({
                value: c.value,
                optionName: c.optionName
              })) || []
            }))
          };

          setTabelOrder(summary);
          console.log('✅ PLACED Bestellung gefunden:', summary);
        } else {
          console.log('ℹ️ Keine Bestellung mit Status "PLACED" gefunden.');
          setTabelOrder(null);
        }
      } else {
        console.warn('⚠️ Unerwartete Antwortstruktur:', response.data);
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der gespeicherten Bestellung:', error);
    }
  };

  fetchTableOrder();
}, [tableIdForOrder]);



// Beispiel: Order_API_BASE = 'http://localhost:5000/api/v1/orders'
const handleBestellungabschließen = async () => {
  if (!tabelOrder?.orderId) {
    console.warn("⚠️ Keine gültige Bestellung vorhanden.");
    return;
  }

  console.log("🟢 Bestellung wird abgeschlossen:", tabelOrder.orderId);

  try {
    const response = await axios.patch(
      `${Order_API_BASE}/${tabelOrder.orderId}/status`,
      { status: "COMPLETED" }
    );

  if (response.status === 200) {
  console.log("✅ Bestellung erfolgreich abgeschlossen:", response.data);

  const tableID = response.data.tableId;

  setTables((prevTables) =>
    prevTables.map((table) =>
      table.id === tableID ? { ...table, isOccupied: false } : table
    )
  );

  setTabelOrder(null);


  // ✅ Snackbar anzeigen
  setSnackbar({
    open: true,
    message: '✅ Bestellung wurde erfolgreich abgeschlossen.',
    severity: 'success',
  });


  //setTimeout(() => {
  //window.location.reload();
//}, 1000); // kleine Verzögerung, damit Snackbar sichtbar bleibt
}
 else {
      console.warn("⚠️ Unerwartete Antwort beim Abschließen:", response);
    }
  } catch (error) {
    setSnackbar({
  open: true,
  message: '❌ Fehler beim Abschließen der Bestellung.',
  severity: 'error',
});
    console.error("❌ Fehler beim Abschließen der Bestellung:", error);
  }
};


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

  const handleCreateTable = async () => {
  const { tableNumber, capacity, isActive} = newTableForm;

  if (!tableNumber || !capacity) {
    setSnackbar({ open: true, message: 'Bitte alle Felder ausfüllen.', severity: 'warning' });
    return;
  }

  try {
    const response = await axios.post(`${Tables_API}`, {
      tableNumber,
      capacity: parseInt(capacity),
      isActive,
      restaurantId: selectedRestaurantId,
    });

    if (response.status === 201 || response.status === 200) {
      // Tisch lokal ergänzen
      setTables((prev) => [...prev, response.data]);

      setSnackbar({ open: true, message: 'Tisch erfolgreich erstellt!', severity: 'success' });
      setShowAddForm(false);

      // Reset Formular
      setNewTableForm({
        tableNumber: '',
        capacity: '',
        isActive: true,
        restaurantId: selectedRestaurantId,
      });
    }
  } catch (error) {
    console.error(error);
    setSnackbar({ open: true, message: 'Fehler beim Erstellen des Tisches.', severity: 'error' });
  }
};

    const fetchTables = async (restaurantId) => {
    try {
      const res = await axios.get(`${Tables_API}/restaurant/${restaurantId}`);
      setTables(res.data);
      console.log("Tablesss",tables);
    } catch (err) {
      console.error(err);
    }
  };


  const showFeedback = (message, severity = 'success') => {
  setFeedback({ open: true, message, severity });
};

  const validateForm = () => {
  const errors = {};
  if (!newTableForm.name.trim()) errors.name = 'Name ist erforderlich';
  if (!newTableForm.description.trim()) errors.description = 'Beschreibung ist erforderlich';
  if (!newTableForm.sortOrder) errors.sortOrder = 'Sortierreihenfolge ist erforderlich';
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





const handleAskDeleteCategory = (TableId, RestaurantId) => {
  setTableToDelete(TableId);
  setRestaurantId(RestaurantId);
  setDeleteTableDialogOpen(true);
  


};




const handleToggleStatus = async (table) => {
  try {
    // Backend-Update
    await axios.patch(`${Tables_API}/${table.id}/toggle-status`);

    // Lokaler Zustand aktualisieren
    setTables((prevTables) =>
      prevTables.map((t) =>
        t.id === table.id ? { ...t, isActive: !t.isActive } : t
      )
    );

    showFeedback('Status wurde erfolgreich geändert.', 'success');
  } catch (error) {
    console.error('Fehler beim Umschalten des Status:', error);
    showFeedback('Statusänderung fehlgeschlagen.', 'error');
  }
};





const handleConfirmDeleteTable = async () => {
  try {
    const response = await axios.delete(`${Tables_API}/${tableToDelete}`);

    if (response.status === 200) {
      // Lokale Aktualisierung der Liste (lösche den Tisch mit der ID)
      setTables((prevTables) => prevTables.filter((t) => t.id !== tableToDelete));

      setSnackbar({
        open: true,
        message: 'Tisch erfolgreich gelöscht',
        severity: 'success',
      });
    }
  } catch (error) {
    setSnackbar({
      open: true,
      message: 'Fehler beim Löschen',
      severity: 'error',
    });
  } finally {
    setDeleteTableDialogOpen(false);
  }
};






const handleUpdateTable = async () => {
  try {
    const { id, tableNumber, capacity, isActive, selectedRestaurantId } = updatedTable;

    const response = await axios.patch(`${Tables_API}/${id}`, {
      tableNumber,
      capacity: parseInt(capacity, 10),
      isActive,
      selectedRestaurantId,
    });

    if (response.status === 200) {
      // Lokalen State aktualisieren
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.id === id
            ? { ...table, tableNumber, capacity: parseInt(capacity, 10), isActive }
            : table
        )
      );

      handleDialogClose();
      showFeedback('Tisch erfolgreich aktualisiert!', 'success');
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    showFeedback('Fehler beim Aktualisieren.', 'error');
  }
};






const handleAdd = async () => {

};




const handleDialogClose = () => {
  setEditDialogOpen(false);
  setUpdatedTable({
    id: '',
    tableNumber: '',
    isActive: '',
    capacity: '',

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





  useEffect(() => {
    fetchRestaurants();

  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchTables(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  
  useEffect(() => {
  if (selectedRestaurantId) {
    fetchCategories(selectedRestaurantId);
  
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
              Tische verwalten
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: colors.primary, color: colors.white, '&:hover': { backgroundColor: colors.accent } }}
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={!selectedRestaurantId}
            >
              Tische hinzufügen
            </Button>
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
    <Typography variant="h5" fontWeight="bold" color={colors.primary}>
      {restaurants[0]?.name}
    </Typography>
  </Box>
</Box>
  </>
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
      Tisch anlegen
    </Typography>

    <Box display="flex" flexDirection="column" gap={3}>
      <TextField
        label="Tischnummer"
        fullWidth
        value={newTableForm.tableNumber}
        onChange={(e) => setNewTableForm({ ...newTableForm, tableNumber: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TableRestaurantIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Sitzplätze"
        type="number"
        fullWidth
        value={newTableForm.capacity}
        onChange={(e) => setNewTableForm({ ...newTableForm, capacity: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventSeatIcon sx={{ color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Tisch aktiv
        </Typography>
        <Switch
          checked={newTableForm.isActive}
          onChange={(e) => setNewTableForm({ ...newTableForm, isActive: e.target.checked })}
          color="success"
        />
      </Box>

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
          onClick={handleCreateTable}
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

{editDialogOpen && (
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
      Tisch bearbeiten
    </Typography>

    <Box display="flex" flexDirection="column" gap={3}>
      {/* Tischnummer */}
      <TextField
        label="Tischnummer"
        value={updatedTable.tableNumber}
        onChange={(e) =>
          setUpdatedTable({ ...updatedTable, tableNumber: e.target.value })
        }
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TableRestaurantIcon sx={{ fontSize: 24, color: colors.primary }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Sitzplätze */}
      <TextField
        label="Anzahl Sitzplätze"
        type="number"
        value={updatedTable.capacity}
        onChange={(e) =>
          setUpdatedTable({ ...updatedTable, capacity: e.target.value })
        }
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EventSeatIcon sx={{ fontSize: 24, color: colors.accent }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Verfügbarkeit */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        border="1px solid"
        borderColor={updatedTable.isActive ? 'error.main' : 'success.main'}
        borderRadius={2}
        bgcolor={updatedTable.isActive ? '#ffebee' : '#e8f5e9'}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            color: updatedTable.isActive ? 'error.main' : 'success.main',
          }}
        >
          {updatedTable.isActive ? 'Tisch Nicht verfügbar' : 'Tisch verfügbar'}
        </Typography>

        <Switch
          checked={updatedTable.isActive}
          onChange={(e) =>
            setUpdatedTable({
              ...updatedTable,
              isActive: e.target.checked,
            })
          }
          color={updatedTable.isActive ? 'error' : 'success'}
        />
      </Box>

      {/* Aktionen */}
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          onClick={() => setEditDialogOpen(false)}
          variant="outlined"
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
          onClick={handleUpdateTable}
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            backgroundColor: colors.accent,
            color: colors.white,
            fontWeight: 'bold',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#b89730' },
          }}
        >
          Aktualisieren
        </Button>
      </Box>
    </Box>
  </Paper>
)}



          {selectedRestaurantId && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ mb: 2, color: colors.primary }}>
               Deine Tische
              </Typography>

        <List>
   
<Grid container spacing={3} justifyContent="center">
  {tables.map((table) => (
    <Grid item xs={6} sm={4} md={3} key={table.id}>
      <Card
          onClick={(event) => {
            setSelectedTableId(table.id); // ✅ immer setzen

            if (table.isOccupied) {
              setTableIdForOrder(table.id);
              setAnchorEl(event.currentTarget); // Nur öffnen, wenn Tisch belegt ist
              setClickedTable(table);
            }
          }}


        sx={{
          cursor: 'pointer',
          width: 160,
          height: 160,
          borderRadius: '50%',
          border: selectedTableId === table.id ? '3px solid gold' : '2px solid #ccc',
          backgroundColor: !table.isOccupied ? '#e0ffe0' : '#ffe0e0',
          boxShadow: !table.isOccupied ? '0 0 10px green' : '0 0 10px red',
          transition: '0.3s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        
        <Tooltip title={`Tisch ${table.tableNumber} - ${table.capacity} Sitzplätze`}>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            {table.isOccupied ? (
              <PeopleAltIcon sx={{ color: colors.primary, fontSize: 36 }} />
            ) : (
              <TableRestaurantIcon sx={{ color: colors.primary, fontSize: 36 }} />
            )}

            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B0000' }}>
              Tisch {table.tableNumber}
            </Typography>

            <Typography variant="subtitle2" sx={{ color: colors.text }}>
              {table.capacity} Plätze
            </Typography>

          </Box>
        </Tooltip>

        <Box mt={1}>
          <Switch
            checked={table.isActive}
            onClick={(e) => e.stopPropagation()}
            onChange={() => handleToggleStatus(table)}
            size="small"
            color={table.isActive ? 'success' : 'error'}
          />
        </Box>
      </Card>

      <Box display="flex" justifyContent="center" gap={1} mt={1}>
        <Tooltip title="Bearbeiten">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setUpdatedTable({
                id: table.id,
                tableNumber: table.tableNumber,
                isActive: table.isActive,
                capacity: table.capacity,
                restaurantId: selectedRestaurantId,
              });
              setEditDialogOpen(true);
            }}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Löschen">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleAskDeleteCategory(table.id, table.restaurantId);
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      </Box>
    </Grid>
  ))}
</Grid>



</List>




            </>
          )}
        </Paper>
      </Container>














<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
>
  <MenuItem onClick={() => {
    setAnchorEl(null);
    setOrderDialogOpen(true);
    console.log("TableOrdner", tabelOrder);
    console.log("Bestellung einsehen für Tisch", clickedTable?.id);
  }}>
    Bestellung einsehen
  </MenuItem>
    <MenuItem onClick={() => {
    setAnchorEl(null);
  //  console.log("Bestellung abschließen");
    handleBestellungabschließen();
  }}>
    Bestellung abschließen
  </MenuItem>
  <MenuItem onClick={() => {
    setAnchorEl(null);
    console.log("Rechnung drucken");
  }}>
    Rechnung drucken
  </MenuItem>

</Menu>




<Dialog
  open={deleteTableDialogOpen}
  onClose={() => setDeleteTableDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>
    <Box display="flex" alignItems="center" gap={1}>
      <DeleteIcon color="error" />
      <Typography variant="h6" color="error">
        Tisch löschen
      </Typography>
    </Box>
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
     Tisch löschen?
    </DialogContentText>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button onClick={() => setDeleteTableDialogOpen(false)} variant="outlined">
      Abbrechen
    </Button>
    <Button onClick={handleConfirmDeleteTable} variant="contained" color="error">
      Löschen
    </Button>
  </DialogActions>
</Dialog>


<OrderSummaryDialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        orderSummary={tabelOrder}
/>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
