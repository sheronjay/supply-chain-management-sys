import { useState, useEffect } from "react";
import RecentOrdersTable from '../../components/orders/RecentOrdersTable/RecentOrdersTable';
import './Orders.css';

const Orders = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        // Map the data to include the 'date' field that the table expects
        const ordersWithDate = data.map(order => ({
          ...order,
          date: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'N/A'
        }));
        setRecentOrders(ordersWithDate);
        setError(null);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const statusTone = { 
    Delivered: 'success', 
    Pending: 'warning', 
    Canceled: 'danger',
    Cancelled: 'danger'
  };

  if (loading) {
    return (
      <div className="orders">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <button onClick={fetchOrders} style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <RecentOrdersTable orders={recentOrders} statusTone={statusTone} />
    </div>
  );
};

export default Orders;