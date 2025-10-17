import { useState } from 'react'
import PropTypes from 'prop-types'
import './AssignedOrdersTable.css'

const AssignedOrdersTable = ({ orders, onMarkDelivered, loading }) => {
  const [deliveringOrders, setDeliveringOrders] = useState(new Set())

  const handleMarkDelivered = async (orderId) => {
    setDeliveringOrders((prev) => new Set(prev).add(orderId))
    try {
      await onMarkDelivered(orderId)
    } finally {
      setDeliveringOrders((prev) => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  if (loading) {
    return (
      <div className="assigned-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="assigned-orders-empty">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <path
            d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M9 22V12h6v10" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h3>No Orders Assigned</h3>
        <p>You currently have no orders assigned to you.</p>
      </div>
    )
  }

  return (
    <div className="assigned-orders-table-wrapper">
      <table className="assigned-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Delivery Address</th>
            <th>Order Date</th>
            <th>Items</th>
            <th>Total Price</th>
            <th>Truck</th>
            <th>Assistant</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isDelivering = deliveringOrders.has(order.order_id)
            const canDeliver = order.status === 'TRUCK'
            
            return (
              <tr key={order.order_id} className={order.status === 'DELIVERED' ? 'delivered-row' : ''}>
                <td className="order-id-cell">
                  <span className="order-id">{order.order_id}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{order.customer_name}</div>
                    <div className="customer-contact">{order.customer_email}</div>
                    {order.customer_phone && (
                      <div className="customer-contact">{order.customer_phone}</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="address-info">
                    <div className="sub-city">{order.sub_city_name || 'N/A'}</div>
                    {order.customer_city && (
                      <div className="full-address">{order.customer_city}</div>
                    )}
                  </div>
                </td>
                <td>
                  {order.ordered_date
                    ? new Date(order.ordered_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </td>
                <td>
                  <div className="items-summary">
                    <span className="items-count">{order.total_items} item(s)</span>
                    {order.items_summary && (
                      <div className="items-detail" title={order.items_summary}>
                        {order.items_summary.length > 40
                          ? `${order.items_summary.substring(0, 40)}...`
                          : order.items_summary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="price-cell">
                  Rs. {parseFloat(order.total_price || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <div className="truck-info">
                    {order.truck_reg_number || 'N/A'}
                  </div>
                </td>
                <td>
                  <div className="assistant-info">
                    {order.assistant_name || 'N/A'}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {canDeliver ? (
                    <button
                      className="btn-deliver"
                      onClick={() => handleMarkDelivered(order.order_id)}
                      disabled={isDelivering}
                    >
                      {isDelivering ? (
                        <>
                          <span className="button-spinner"></span>
                          Marking...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="deliver-icon">
                            <polyline
                              points="20 6 9 17 4 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          Mark Delivered
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="delivered-label">✓ Delivered</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

AssignedOrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      customer_name: PropTypes.string,
      customer_email: PropTypes.string,
      customer_phone: PropTypes.string,
      customer_address: PropTypes.string,
      sub_city_name: PropTypes.string,
      ordered_date: PropTypes.string,
      total_items: PropTypes.number,
      items_summary: PropTypes.string,
      total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      truck_reg_number: PropTypes.string,
      assistant_name: PropTypes.string,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMarkDelivered: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default AssignedOrdersTable
