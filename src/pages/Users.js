import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Container, Paper, Typography, TextField, Button, Divider,
  useTheme, useMediaQuery, InputAdornment, IconButton, List,
  ListItem, ListItemText, MenuItem, Snackbar, Alert,  ListItemIcon,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';

const API_URL = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/users';
const RESTAURANT_URL = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/restaurants';

const roles = ['ADMIN', 'MANAGER', 'USER'];

const UserManagement = () => {
  const [form, setForm] = useState({ email:'', phone:'', firstName:'', lastName:'', role:'', restaurantId:'' });
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [feedback, setFeedback] = useState({ open:false, message:'', severity:'success' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { 
    fetchUsers(); 
    fetchRestaurants(); 
  }, 
  []);

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data.data);
  };
  const fetchRestaurants = async () => {
    const res = await axios.get(RESTAURANT_URL);
    setRestaurants(res.data.data);
  };

  const showFeedback = (msg, sev='success') => setFeedback({ open:true, message:msg, severity:sev });
  

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleToggleStatus = async (user) => {
  try {
    if (user.isActive) {
      // Deaktivieren
      await axios.patch(`${API_URL}/${user.id}/deactivate`);
      showFeedback('User wurde deaktiviert.', 'info');
    } else {
      // Reaktivieren
      await axios.patch(`${API_URL}/${user.id}/reactivate`);
      showFeedback('User wurde reaktiviert.', 'success');
    }

    fetchUsers();
  } catch (error) {
    console.error('Fehler beim Umschalten des Status:', error);
    showFeedback('Statusänderung fehlgeschlagen.', 'error');
  }
};
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editUser) {
        await axios.patch(`${API_URL}/${editUser.id}`, form);
        showFeedback('Benutzer erfolgreich aktualisiert!', 'success');
      } else {
        await axios.post(API_URL, form);
        showFeedback('Benutzer erfolgreich erstellt!', 'success');
      }
      setShowForm(false); setEditUser(null); setForm({ email:'', phone:'', firstName:'', lastName:'', role:'', restaurantId:'' });
      fetchUsers();
    } catch {
      showFeedback('Fehler beim Speichern des Benutzers.', 'error');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Wirklich löschen?')) return;
    try { await axios.delete(`${API_URL}/${id}/hard`); fetchUsers(); showFeedback('Benutzer gelöscht.', 'success'); }
    catch { showFeedback('Fehler beim Löschen.', 'error'); }
  };

  const handleEdit = user => {
    setEditUser(user);
    setForm({
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      restaurantId: user.restaurantId
    });
    setShowForm(true);
  };

  const colors = { primary:'#8B2E2E', accent:'#D4AF37', background:'#F5EFE6', text:'#3E3E3E', white:'#FFF', border:'#D6CCC2' };
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius:2, backgroundColor:colors.white,
      '& fieldset':{ borderColor: colors.border },
      '&:hover fieldset':{ borderColor: colors.accent },
      '&.Mui-focused fieldset':{ borderColor: colors.primary, borderWidth:2 }
    }
  };

  return (
    <Box sx={{ minHeight:'100vh', backgroundColor:colors.background, py:6 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius:4, p:isMobile?3:5, backgroundColor:colors.white }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color:colors.primary }}>Benutzer</Typography>
            <Button variant="contained"
              sx={{ backgroundColor: colors.primary, '&:hover':{backgroundColor:colors.accent}, color:'white' }}
              startIcon={<AddIcon />} onClick={() => { setShowForm(!showForm); setEditUser(null); setForm({ email:'', phone:'', firstName:'', lastName:'', role:'', restaurantId:'' });}}
            >
              {showForm ? 'Abbrechen' : (editUser ? 'Bearbeiten' : 'Hinzufügen')}
            </Button>
          </Box>

          <Divider sx={{ mb:4, borderColor:colors.border }} />

          {showForm && (
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
              {[{ 
                label:'E-Mail', name:'email', icon:<EmailIcon/>, type:'email' }, 
                { label:'Telefon', name:'phone', icon:<PhoneIcon/> }, 
                { label:'Vorname', name:'firstName', icon:<PersonIcon/> }, 
                { label:'Nachname', name:'lastName', icon:<PersonIcon/> }
               ].map(({label,name,icon,type}) => (
                <TextField key={name} 
                label={label} 
                name={name} 
                type={type||'text'}
                value={form[name]} 
                onChange={handleChange} 
                required fullWidth
                sx={textFieldStyle}
                InputProps={{ 
                 startAdornment: (
                                       <InputAdornment position="start">
                                         {React.cloneElement(icon, { sx: { color: colors.accent } })}
                                       </InputAdornment>
                                     )
                    
                  }}
                />
              ))}

              <TextField select required label="Rolle" name="role" value={form.role} onChange={handleChange} fullWidth sx={textFieldStyle}>
                {roles.map(r=> <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>

              <TextField select required label="Restaurant" name="restaurantId" value={form.restaurantId} onChange={handleChange} fullWidth sx={textFieldStyle}>
                {restaurants.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </TextField>

              <Button type="submit" variant="contained"
                sx={{ backgroundColor: colors.primary, color:'white', '&:hover':{backgroundColor:colors.accent} }}
              >
                {editUser ? 'Aktualisieren' : 'Speichern'}
              </Button>
            </Box>
          )}

          <List>
            {users.map(user => (


              <ListItem key={user.id} 
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
                            checked={user.isActive}
                           onChange={() => handleToggleStatus(user)}
                           color="success"
                            />
                     {/* Edit Button nur wenn aktiv */}
          {user.isActive && (
            <IconButton
              edge="end"
              aria-label="bearbeiten"
              onClick={() => {
                handleEdit(user);
               
              }}
            >
              <EditIcon sx={{ color: colors.primary }} />
            </IconButton>
          )}
                <>
                 
                  <IconButton onClick={()=>handleDelete(user.id)}><DeleteIcon sx={{ color:'darkred' }}/></IconButton>
                </>
                </Box>
              }>

                 <ListItemIcon sx={{ mt: 0.1 }}>
                    <StoreIcon sx={{ color: colors.primary }} />
                  </ListItemIcon>

                <ListItemText
                  primary={
                     <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                                {user.firstName}  {user.lastName} 
                        </Typography>
             
                    
                  }

                  secondary={

                  

                    <Box sx={{ mt: 1 }}>
                           <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <DescriptionIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                              {user.role}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <PhoneIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                              {user.phone}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <EmailIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                              {user.email}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <EmailIcon sx={{ fontSize: 18, color: colors.accent }} />
                            <Typography sx={{ color: colors.text, fontSize: '1rem' }}>
                               {user.restaurant?.name || 'Kein Restaurantname'}
                            </Typography>
                        </Box>
                   

                      </Box>
                  }
                />
              </ListItem>


            ))}
            {users.length===0 && <Typography sx={{ color:colors.text }} align="center">Keine Benutzer gefunden.</Typography>}
          </List>
        </Paper>

        <Snackbar
          open={feedback.open} autoHideDuration={4000}
          onClose={()=>setFeedback({...feedback, open:false})}
          anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
        >
          <Alert severity={feedback.severity} onClose={()=>setFeedback({...feedback, open:false})}>
            {feedback.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserManagement;
