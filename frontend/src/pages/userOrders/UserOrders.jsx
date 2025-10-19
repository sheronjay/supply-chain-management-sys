import React, { useState, useEffect } from "react";
import AddOrderModal from "../../components/orders/AddOrderModal/AddOrderModal";
import UserOrdersTable from "../../components/orders/UserOrdersTable/UserOrdersTable";
import api from "../../services/api";
import "./UserOrders.css";

const UserOrders = () => {
  // Hardcoded customer from database (CUST-0001: Sunrise Wholesale)
  const CUSTOMER_ID = "CUST-0001";
  const CUSTOMER_NAME = "Sunrise Wholesale";
  const CUSTOMER_CITY = "Colombo";
  const STORE_ID = "ST-CMB-01"; // Colombo store
  const SUB_CITY_ID = "SC-CMB-001"; // Pettah sub-city

  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders for the hardcoded customer
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/user/${CUSTOMER_ID}`);
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
  }, []);

  const handleCreateOrder = async (newOrder) => {
    try {
      console.log('Creating order:', newOrder);
      
      const response = await api.post('/orders', {
        customerId: CUSTOMER_ID,
        customerName: CUSTOMER_NAME,
        storeId: STORE_ID,
        subCityId: SUB_CITY_ID,
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

  return (
    <div className="user-orders-page">
      <div className="header">
        <div className="customer-info">
          <h1>My Orders</h1>
          <p className="customer-name">Customer: {CUSTOMER_NAME} ({CUSTOMER_ID})</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-order-btn"
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
        customerName={CUSTOMER_NAME}
      />
    </div>
  );
};

export default UserOrders;
