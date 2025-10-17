import PropTypes from 'prop-types'
import { useState } from 'react'
import AssignTruckModal from '../AssignTruckModal/AssignTruckModal'
import './StoreInventoryTable.css'

const StoreInventoryTable = ({ inventory, loading, storeId, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleAssignClick = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleAssignSuccess = () => {
    // Refresh the inventory list
    if (onRefresh) {
      onRefresh()
    }
  }

  if (loading) {
    return (
      <div className="store-inventory-loading">
        <div className="spinner"></div>
        <p>Loading inventory...</p>
      </div>
    )
  }

  if (inventory.length === 0) {
    return (
      <div className="store-inventory-empty">
        <svg viewBox="0 0 24 24" className="empty-icon">
          <rect x="3" y="8" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M3 8l9-6 9 6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h3>No Items in Inventory</h3>
        <p>There are currently no orders with IN-STORE status for this store.</p>
      </div>
    )
  }

  return (
    <>
      <div className="store-inventory-table-wrapper">
        <table className="store-inventory-table">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((order) => (
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
                  <span className="status-badge status-in-store">{order.status}</span>
                </td>
                <td className="actions-cell">
                  <button 
                    className="btn-assign-truck"
                    onClick={() => handleAssignClick(order)}
                    title="Assign to truck for delivery"
                  >
                    <svg viewBox="0 0 24 24" className="truck-icon">
                      <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z" fill="currentColor"/>
                    </svg>
                    Assign Truck
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignTruckModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        order={selectedOrder}
        storeId={storeId}
        onSuccess={handleAssignSuccess}
      />
    </>
  )
}

StoreInventoryTable.propTypes = {
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      customer_name: PropTypes.string,
      customer_email: PropTypes.string,
      customer_phone: PropTypes.string,
      sub_city_name: PropTypes.string,
      ordered_date: PropTypes.string,
      items_summary: PropTypes.string,
      total_items: PropTypes.number,
      total_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      total_capacity_required: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool,
  storeId: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
}

StoreInventoryTable.defaultProps = {
  loading: false,
  onRefresh: null,
}

export default StoreInventoryTable
