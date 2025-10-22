import { useState } from "react";
import "./UserOrdersTable.css";
import OrderDetailsModal from "../OrderDetailsModal/OrderDetailsModal";

const UserOrdersTable = ({ orders, statusTone }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Handle MySQL DATE format (YYYY-MM-DD) properly
    // Add 'T00:00:00' to ensure it's treated as local date, not UTC
    const date = new Date(dateString + 'T00:00:00');
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusClass = (status) => {
    return statusTone[status] || "default";
  };

  return (
    <div className="user-orders-table">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <p>Click "Add New Order" to create your first order.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Route</th>
                <th>Order Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id">
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.route || "N/A"}</td>
                  <td>{formatDate(order.deliveryDate)}</td>
                  <td className="amount">LKR {order.totalAmount?.toLocaleString() || 0}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <OrderDetailsModal
            isOpen={selectedOrderId !== null}
            onClose={() => setSelectedOrderId(null)}
            orderId={selectedOrderId}
          />
        </div>
      )}
    </div>
  );
};

export default UserOrdersTable;
