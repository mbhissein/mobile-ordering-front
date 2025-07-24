import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Startseite from './pages/Startseite';
import BestellenPage from './pages/BestellenPage';
import KategoriePage from './pages/KategoriePage';
import MenuePage from './pages/MenuePage'; // wichtig!
import Header from './components/Header';
import Footer from './components/Footer';
import HeaderImage from './components/HeaderImage';
import Selbstabholung from './pages/Selbstabholung';
import Restaurant from './pages/Restaurant';
import Users from './pages/Users';
import Tische from './pages/Tische';
import CartDialog from './components/CartDialog';
import OrderSummaryDialog from './components/OrderSummaryDialog';
import { useEffect } from 'react';
import axios from 'axios'; // falls nicht schon importiert
import OrderProgressDialog from './components/OrderProgressDialog';


const Order_API_BASE = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/orders';
const Table_API_BASE = 'http://ec2-56-228-8-40.eu-north-1.compute.amazonaws.com:8000/api/v1/tables';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartDialogOpen, setCartDialogOpen] = useState(false); // 🛒 Dialog öffnen/schließen
const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
const [orderDialogOpen, setOrderDialogOpen] = useState(false);
const [orderSummary, setOrderSummary] = useState(null);
const [tablesStatus, setTablesStatus] = useState([]);





useEffect(() => {
  const fetchOrderFromStorage = async () => {
    const storedOrderId = localStorage.getItem('currentOrderId');
    if (!storedOrderId) return;

    try {
      const response = await axios.get(`${Order_API_BASE}/${storedOrderId}`);

      if (response.status === 200) {
        const data = response.data;

        if (data.status === 'PLACED') {
          const summary = {
            status: data.status,
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
            tableId: data.tableId,
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

          setOrderSummary(summary);
          console.log('✅ Bestehende Bestellung geladen:', summary);

          // 🟢 Tischstatus laden
          if (data.tableId) {
            try {
              const tableResponse = await axios.get(`${Table_API_BASE}/${data.tableId}`);
              if (tableResponse.status === 200) {
                setTablesStatus(tableResponse.data);
                console.log('🪑 Tischstatus geladen:', tableResponse.data);
              }
            } catch (tableError) {
              console.error('❌ Fehler beim Laden des Tischstatus:', tableError);
            }
          }
        } else {
          console.log(`ℹ️ Bestellung hat Status "${data.status}", wird ignoriert.`);
        }
      }
    } catch (error) {
      console.error('❌ Fehler beim Laden der gespeicherten Bestellung:', error);
    }
  };

  fetchOrderFromStorage();
}, []);




const handleShowOrderSummary = () => {
  console.log("🟢 Footer Button wurde geklickt");
  if (orderSummary) {
    setOrderDialogOpen(true);
  } else {
    alert("Noch keine Bestellung vorhanden.");
  }
};



  const handleQuantityChange = (index, newQty) => {
  const updated = [...cartItems];
  updated[index].quantity = newQty;
  setCartItems(updated);
  console.log("CartInhalt", cartItems);
};

const handleRemove = (index) => {
  const updated = [...cartItems];
  updated.splice(index, 1);
  setCartItems(updated);
    console.log("CartInhalt", cartItems);
};



  return (
    <BrowserRouter>
     <Header
        cartItemCount={cartItems.length}
        onCartClick={() => setCartDialogOpen(true)} // Übergabe der Öffnen-Funktion
      />
      <HeaderImage />

      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/bestellen" element={<BestellenPage />} />
        <Route path="/kategorie" element={<KategoriePage />} />
        <Route path="/menue" element={<MenuePage cartItems={cartItems} setCartItems={setCartItems} setSelectedRestaurantId={setSelectedRestaurantId} selectedRestaurantId={selectedRestaurantId}  orderSummary={orderSummary}/> }  />
        <Route path="/selbstabholung" element={<Selbstabholung />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/tische" element={<Tische   setOrderSummary={setOrderSummary} />} />
        <Route path="/users" element={<Users />} />
   

      </Routes>

<CartDialog
  open={cartDialogOpen}
  onClose={() => setCartDialogOpen(false)}
  cartItems={cartItems}
  setCartItems={setCartItems}
  handleRemove={handleRemove}
  handleQuantityChange={handleQuantityChange}
  selectedRestaurantId={selectedRestaurantId}
  setSelectedRestaurantId={setSelectedRestaurantId} 
  setOrderSummary={setOrderSummary}
/>

<Footer
  onShowOrderSummary={handleShowOrderSummary}
  hasOrder={!!orderSummary}
/>


<OrderSummaryDialog
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        orderSummary={orderSummary}
/>




    </BrowserRouter>
  );
}

export default App;
