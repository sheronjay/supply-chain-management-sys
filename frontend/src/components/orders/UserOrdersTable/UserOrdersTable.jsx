import { useState } from "react";
import "./UserOrdersTable.css";

const UserOrdersTable = ({ orders, statusTone }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
                <>
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
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="6">
                        <div className="order-details">
                          <h4>Order Items</h4>
                          {order.items && order.items.length > 0 ? (
                            <table className="items-table">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Quantity</th>
                                  <th>Unit Price</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.qty}</td>
                                    <td>LKR {item.price?.toFixed(2) || "0.00"}</td>
                                    <td>LKR {item.amount?.toFixed(2) || "0.00"}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="3" className="total-label">Total:</td>
                                  <td className="total-amount">
                                    LKR {order.totalAmount?.toFixed(2) || "0.00"}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          ) : (
                            <p className="no-items">No items found for this order.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrdersTable;
