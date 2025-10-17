import React, { useState, useEffect } from "react";
import AddOrderModal from "../../components/orders/AddOrderModal/AddOrderModal";
import UserOrdersTable from "../../components/orders/UserOrdersTable/UserOrdersTable";
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
      const response = await fetch(`http://localhost:5000/api/orders/user/${CUSTOMER_ID}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch orders');
      }
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
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: CUSTOMER_ID,
          customerName: CUSTOMER_NAME,
          storeId: STORE_ID,
          subCityId: SUB_CITY_ID,
          items: newOrder.items,
          totalAmount: newOrder.totalAmount,
          status: 'PENDING',
          orderedDate: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);
        
        // Refresh orders list from server
        await fetchOrders();
        
        alert('Order created successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Failed to create order: ${error.message}`);
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
