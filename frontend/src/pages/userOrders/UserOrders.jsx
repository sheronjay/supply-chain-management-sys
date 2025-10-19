import React, { useState, useEffect } from "react";
import AddOrderModal from "../../components/orders/AddOrderModal/AddOrderModal";
import UserOrdersTable from "../../components/orders/UserOrdersTable/UserOrdersTable";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./UserOrders.css";

const UserOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const [subCities, setSubCities] = useState([]);
  const [selectedSubCity, setSelectedSubCity] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Fetch store and sub-cities based on customer's city from the database
  useEffect(() => {
    const fetchLocationData = async () => {
      if (!user?.city) return;

      try {
        setLoadingLocation(true);
        
        // Fetch store for customer's city
        const storeResponse = await api.get(`/location/stores/city/${encodeURIComponent(user.city)}`);
        
        if (storeResponse.data && storeResponse.data.store_id) {
          const customerStoreId = storeResponse.data.store_id;
          setStoreId(customerStoreId);
          
          // Fetch sub-cities for the store
          const subCityResponse = await api.get(`/location/sub-cities/store/${customerStoreId}`);
          const availableSubCities = subCityResponse.data || [];
          
          setSubCities(availableSubCities);
          
          // Set first sub-city as default
          if (availableSubCities.length > 0) {
            setSelectedSubCity(availableSubCities[0].sub_city_id);
          }
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to load store information for your city.');
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocationData();
  }, [user?.city]);

  // Fetch orders for the authenticated customer
  const fetchOrders = async () => {
    if (!user?.customer_id) return;

    try {
      setLoading(true);
      const response = await api.get(`/orders/user/${user.customer_id}`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.customer_id]);

  const handleCreateOrder = async (newOrder) => {
    if (!user?.customer_id || !storeId || !selectedSubCity) {
      alert('Missing required customer or location information. Please refresh the page.');
      return;
    }

    try {
      console.log('Creating order:', newOrder);
      
      const response = await api.post('/orders', {
        customerId: user.customer_id,
        customerName: user.name,
        storeId: storeId,
        subCityId: selectedSubCity,
        items: newOrder.items,
        totalAmount: newOrder.totalAmount,
        status: 'PENDING',
        orderedDate: new Date().toISOString().split('T')[0]
      });

      console.log('Order created successfully:', response.data);
      
      // Refresh orders list from server
      await fetchOrders();
      
      alert('Order created successfully!');
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order';
      alert(`Failed to create order: ${errorMessage}`);
    }
  };

  const statusTone = {
    PENDING: "pending",
    SCHEDULED: "scheduled",
    PLACED: "placed",
    DELIVERED: "completed",
    CANCELLED: "cancelled",
  };

  // Show loading or error states for unauthenticated users
  if (!user) {
    return (
      <div className="user-orders-page">
        <div className="error-message">Please log in to view your orders.</div>
      </div>
    );
  }

  return (
    <div className="user-orders-page">
      <div className="header">
        <div className="customer-info">
          <h1>My Orders</h1>
          <p className="customer-name">Customer: {user.name} ({user.customer_id})</p>
          {user.city && <p className="customer-city">City: {user.city}</p>}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-order-btn"
          disabled={!storeId || !selectedSubCity || loadingLocation}
          title={!storeId || !selectedSubCity ? 'Loading location data...' : 'Create a new order'}
        >
          Add New Order
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Loading orders...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <UserOrdersTable orders={orders} statusTone={statusTone} />
      )}

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrder}
        customerName={user.name}
      />
    </div>
  );
};

export default UserOrders;
