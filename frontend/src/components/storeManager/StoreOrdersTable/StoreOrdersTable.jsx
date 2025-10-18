import { useState } from 'react'
import PropTypes from 'prop-types'
import './StoreOrdersTable.css'

const StoreOrdersTable = ({ orders, onAcceptOrder, loading }) => {
  const [acceptingOrders, setAcceptingOrders] = useState(new Set())

  const handleAcceptOrder = async (orderId) => {
    setAcceptingOrders((prev) => new Set(prev).add(orderId))
    try {
      await onAcceptOrder(orderId)
    } finally {
      setAcceptingOrders((prev) => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  if (loading) {
    return (
      <div className="store-orders-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="store-orders-empty">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <path
            d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M10 5v2h4V5" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h3>No Orders Available</h3>
        <p>There are currently no orders with TRAIN status for this store.</p>
      </div>
    )
  }

  return (
    <div className="store-orders-table-wrapper">
      <table className="store-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Sub-City</th>
            <th>Order Date</th>
            <th>Items</th>
            <th>Total Price</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isAccepting = acceptingOrders.has(order.order_id)
            
            return (
              <tr key={order.order_id}>
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
                <td>{order.sub_city_name || 'N/A'}</td>
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
                        {order.items_summary.length > 50
                          ? `${order.items_summary.substring(0, 50)}...`
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
                <td className="capacity-cell">
                  {parseFloat(order.total_capacity_required || 0).toFixed(2)} m³
                </td>
                <td>
                  <span className="status-badge status-train">{order.status}</span>
                </td>
                <td>
                  <button
                    className="btn-accept"
                    onClick={() => handleAcceptOrder(order.order_id)}
                    disabled={isAccepting}
                  >
                    {isAccepting ? (
                      <>
                        <span className="button-spinner"></span>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="accept-icon">
                          <polyline
                            points="20 6 9 17 4 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Accept
                      </>
                    )}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

StoreOrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      customer_name: PropTypes.string,
      customer_email: PropTypes.string,
      customer_phone: PropTypes.string,
      sub_city_name: PropTypes.string,
      ordered_date: PropTypes.string,
      total_items: PropTypes.number,
      items_summary: PropTypes.string,
      total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total_capacity_required: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
    })
  ).isRequired,
  onAcceptOrder: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default StoreOrdersTable
