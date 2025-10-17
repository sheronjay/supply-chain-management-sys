import { useState, useEffect } from "react";
import { useAuth } from '../../context/AuthContext';
import RecentOrdersTable from '../../components/orders/RecentOrdersTable/RecentOrdersTable';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal/OrderDetailsModal';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Prepare headers with user authentication data
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add user data to headers if user is logged in
      if (user) {
        headers['x-user-data'] = JSON.stringify(user);
      }
      
      const response = await fetch('http://localhost:5000/api/orders', {
        headers
      });
      
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

  // Load data on component mount and when user changes
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const statusTone = { 
    DELIVERED: 'success',
    SCHEDULED: 'info', 
    PENDING: 'warning',
    PLACED: 'warning',
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
      <RecentOrdersTable 
        orders={recentOrders} 
        statusTone={statusTone}
        onViewOrder={handleViewOrder}
      />
      
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default Orders;