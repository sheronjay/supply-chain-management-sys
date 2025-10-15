import React, { useState, useEffect } from "react";
import AddOrderModal from "../../components/orders/AddOrderModal/AddOrderModal";
import UserOrdersTable from "../../components/orders/UserOrdersTable/UserOrdersTable";
import "./UserOrders.css";

const UserOrders = () => {
  const [orders, setOrders] = useState([
    // Default data shown immediately
    { id: 'ORD001', customer: 'Test User', status: 'Pending', route: 'Colombo', items: [], totalAmount: 2500, deliveryDate: '2025-01-15' },
    { id: 'ORD002', customer: 'Test User', status: 'Delivered', route: 'Kandy', items: [], totalAmount: 400, deliveryDate: '2025-01-16' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId") || "test-user-123";

  // Fetch orders silently in background
  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Keep showing default data
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handleCreateOrder = async (newOrder) => {
    try {
      console.log('Creating order:', newOrder);
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: newOrder.customerName,
          customerId: userId,
          items: newOrder.items,
          totalAmount: newOrder.totalAmount,
          status: 'Pending',
          route: newOrder.route
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);
        
        // Add new order to the list immediately
        const newOrderItem = {
          id: result.orderId,
          customer: newOrder.customerName,
          status: 'Pending',
          route: newOrder.route,
          items: newOrder.items,
          totalAmount: newOrder.totalAmount,
          deliveryDate: new Date().toISOString().split('T')[0]
        };
        
        setOrders(prev => [newOrderItem, ...prev]);
        
        alert('Order created successfully!');
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const statusTone = {
    Pending: "pending",
    Delivered: "completed",
    Cancelled: "cancelled",
  };

  return (
    <div className="user-orders-page">
      <div className="header">
        <h1>My Orders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-order-btn"
        >
          Add New Order
        </button>
      </div>

      <UserOrdersTable orders={orders} statusTone={statusTone} />

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrder}
      />
    </div>
  );
};

export default UserOrders;
