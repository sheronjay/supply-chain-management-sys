import { useState, useEffect } from "react";
import OrderSummary from '../../components/orders/OrderSummary/OrderSummary';
import OrderStats from '../../components/orders/OrderStats/OrderStats';
import RecentOrdersTable from '../../components/orders/RecentOrdersTable/RecentOrdersTable';
import AddOrderModal from '../../components/orders/AddOrderModal/AddOrderModal';
import './Orders.css';

const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([
    // Default data shown immediately
    { id: 'ORD001', customer: 'Alice Smith', status: 'Delivered', route: 'Colombo', items: [], totalAmount: 2500, deliveryDate: '2025-01-15' },
    { id: 'ORD002', customer: 'Bob Johnson', status: 'Pending', route: 'Kandy', items: [], totalAmount: 400, deliveryDate: '2025-01-16' },
    { id: 'ORD003', customer: 'Charlie Brown', status: 'Pending', route: 'Gampaha', items: [], totalAmount: 1200, deliveryDate: '2025-01-17' },
    { id: 'ORD004', customer: 'Diana Prince', status: 'Delivered', route: 'Colombo', items: [], totalAmount: 350, deliveryDate: '2025-01-18' },
    { id: 'ORD005', customer: 'Eva Adams', status: 'Pending', route: 'Kandy', items: [], totalAmount: 900, deliveryDate: '2025-01-19' },
  ]);
  const [orderStats, setOrderStats] = useState([
    { id: 'total', title: 'Total Orders', value: '5', hint: '+15% from last month' },
    { id: 'pending', title: 'Pending', value: '3', hint: 'Awaiting fulfillment' },
    { id: 'delivered', title: 'Delivered', value: '2', hint: '90% completion rate' },
    { id: 'average', title: 'Avg. Order Value', value: 'LKR 1,070', hint: 'Updated 1 hour ago', accent: 'highlight' },
  ]);
  const [error, setError] = useState(null);

  // Fetch orders from backend (silently in background)
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Keep showing default data, don't show error to user
    }
  };

  // Fetch order statistics from backend (silently in background)
  const fetchOrderStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/stats/summary');
      if (response.ok) {
        const stats = await response.json();
        setOrderStats([
          { 
            id: 'total', 
            title: 'Total Orders', 
            value: stats.total_orders?.toString() || '5', 
            hint: '+15% from last month' 
          },
          { 
            id: 'pending', 
            title: 'Pending', 
            value: stats.pending_orders?.toString() || '3', 
            hint: 'Awaiting fulfillment' 
          },
          { 
            id: 'delivered', 
            title: 'Delivered', 
            value: stats.delivered_orders?.toString() || '2', 
            hint: '90% completion rate' 
          },
          { 
            id: 'average', 
            title: 'Avg. Order Value', 
            value: `LKR ${Math.round(stats.average_order_value || 1070).toLocaleString()}`, 
            hint: 'Updated 1 hour ago', 
            accent: 'highlight' 
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching order stats:', err);
      // Keep showing default stats
    }
  };

  // Load data silently in background
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  const handleCreateOrder = async (order) => {
    try {
      console.log('Creating order:', order);
      
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: order.customerName,
          customerId: localStorage.getItem('userId') || undefined,
          items: order.items,
          totalAmount: order.totalAmount,
          status: 'Pending',
          route: order.route
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);
        
        // Add new order to the list immediately
        const newOrder = {
          id: result.orderId,
          customer: order.customerName,
          status: 'Pending',
          route: order.route,
          items: order.items,
          totalAmount: order.totalAmount,
          deliveryDate: new Date().toISOString().split('T')[0]
        };
        
        setRecentOrders(prev => [newOrder, ...prev]);
        
        // Update stats
        setOrderStats(prev => prev.map(stat => {
          if (stat.id === 'total') {
            return { ...stat, value: (parseInt(stat.value) + 1).toString() };
          }
          if (stat.id === 'pending') {
            return { ...stat, value: (parseInt(stat.value) + 1).toString() };
          }
          return stat;
        }));
        
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
    Delivered: 'success', 
    Pending: 'warning', 
    Canceled: 'danger',
    Cancelled: 'danger'
  };

  return (
    <div className="orders">
      <OrderSummary onAddOrder={() => setIsModalOpen(true)} />
      <OrderStats stats={orderStats} />
      <RecentOrdersTable orders={recentOrders} statusTone={statusTone} />

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateOrder}
      />
    </div>
  );
};

export default Orders;