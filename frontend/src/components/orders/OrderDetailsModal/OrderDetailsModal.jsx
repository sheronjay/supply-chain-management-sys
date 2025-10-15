import { useEffect, useState } from "react";
import "./OrderDetailsModal.css";

const OrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      } else {
        throw new Error('Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="order-details-overlay" onClick={onClose}>
      <div className="order-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="order-details-header">
          <h2>Order Details</h2>
          <button className="order-details-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="order-details-body">
          {loading ? (
            <div className="order-details-loading">
              <p>Loading order details...</p>
            </div>
          ) : error ? (
            <div className="order-details-error">
              <p>{error}</p>
              <button onClick={fetchOrderDetails}>Retry</button>
            </div>
          ) : orderDetails ? (
            <>
              <div className="order-details-info">
                <div className="order-detail-row">
                  <span className="order-detail-label">Order ID:</span>
                  <span className="order-detail-value">{orderDetails.id || 'N/A'}</span>
                </div>
                
                <div className="order-detail-row">
                  <span className="order-detail-label">Customer:</span>
                  <span className="order-detail-value">{orderDetails.customer || 'N/A'}</span>
                </div>
                
                <div className="order-detail-row">
                  <span className="order-detail-label">Delivery Date:</span>
                  <span className="order-detail-value">{formatDate(orderDetails.deliveryDate)}</span>
                </div>
                
                <div className="order-detail-row">
                  <span className="order-detail-label">Status:</span>
                  <span className={`order-detail-status order-detail-status--${orderDetails.status?.toLowerCase()}`}>
                    {orderDetails.status || 'N/A'}
                  </span>
                </div>
                
                <div className="order-detail-row">
                  <span className="order-detail-label">Route:</span>
                  <span className="order-detail-value">{orderDetails.route || 'N/A'}</span>
                </div>
              </div>

              <div className="order-items-section">
                <h3>Items Ordered:</h3>
                
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price (LKR)</th>
                        <th>Amount (LKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name || 'N/A'}</td>
                          <td>{item.qty || 0}</td>
                          <td>{item.price ? parseFloat(item.price).toFixed(2) : '0.00'}</td>
                          <td>{item.amount ? parseFloat(item.amount).toFixed(2) : '0.00'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-items">No items found for this order.</p>
                )}
              </div>

              <div className="order-total">
                <span className="order-total-label">Total Amount:</span>
                <span className="order-total-value">
                  LKR {orderDetails.totalAmount ? parseFloat(orderDetails.totalAmount).toFixed(2) : '0.00'}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
