import { useState } from 'react'
import ProcessOrderModal from '../ProcessOrderModal/ProcessOrderModal'
import './PendingOrdersTable.css'

const PendingOrdersTable = ({ orders, onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleProcessClick = (order) => {
    setSelectedOrder(order)
  }

  const handleModalClose = () => {
    setSelectedOrder(null)
  }

  const handleProcessSuccess = () => {
    setSelectedOrder(null)
    onRefresh()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (orders.length === 0) {
    return (
      <div className="pending-orders-empty">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h3>No Pending Orders</h3>
        <p>All orders have been processed or there are no new orders.</p>
      </div>
    )
  }

  return (
    <>
      <div className="pending-orders-table-container">
        <table className="pending-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Capacity Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="order-id">{order.order_id}</td>
                <td>
                  <div className="customer-info">
                    <span className="customer-name">{order.customer_name}</span>
                    <span className="customer-email">{order.customer_email}</span>
                  </div>
                </td>
                <td>
                  <div className="destination-info">
                    <span className="city">{order.store_city}</span>
                    <span className="sub-city">{order.sub_city_name}</span>
                  </div>
                </td>
                <td>{formatDate(order.ordered_date)}</td>
                <td className="price">Rs. {parseFloat(order.total_price).toFixed(2)}</td>
                <td className="capacity">{parseFloat(order.total_capacity_required).toFixed(2)} units</td>
                <td>
                  <button 
                    className="btn-process"
                    onClick={() => handleProcessClick(order)}
                  >
                    Process
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <ProcessOrderModal
          order={selectedOrder}
          onClose={handleModalClose}
          onSuccess={handleProcessSuccess}
        />
      )}
    </>
  )
}

export default PendingOrdersTable
