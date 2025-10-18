import { useState, useEffect } from 'react'
import { fetchStoreOrders, acceptOrder } from '../../services/storeManagerService'
import StoreOrdersTable from '../../components/storeManager/StoreOrdersTable/StoreOrdersTable'
import './StoreManager.css'

const StoreManager = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // For now, hardcode CMB store
  const storeId = 'ST-CMB-01'
  const storeName = 'Colombo Main Store'
  const managerId = 'MGR-CMB-001'

  useEffect(() => {
    loadStoreOrders()
  }, [])

  const loadStoreOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStoreOrders(storeId)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      const result = await acceptOrder(orderId, managerId)
      
      // Show success message
      setSuccessMessage(`Order ${orderId} accepted successfully!`)
      
      // Remove the accepted order from the list
      setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId))
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err.message)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  }

  const totalOrders = orders.length
  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0)
  const totalCapacity = orders.reduce(
    (sum, order) => sum + parseFloat(order.total_capacity_required || 0),
    0
  )

  return (
    <div className="store-manager">
      <div className="store-manager-header">
        <div>
          <h2>{storeName}</h2>
          <p className="store-subtitle">
            Store ID: <span className="store-id-badge">{storeId}</span> | Manager ID:{' '}
            <span className="store-id-badge">{managerId}</span>
          </p>
          <p className="store-description">
            Accept incoming orders that have arrived by train and are ready for processing
          </p>
        </div>
        <button className="btn-refresh" onClick={loadStoreOrders} disabled={loading}>
          <svg viewBox="0 0 24 24" className="refresh-icon">
            <path
              d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert-success">
          <svg viewBox="0 0 24 24" className="alert-icon">
            <path
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <svg viewBox="0 0 24 24" className="alert-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="store-manager-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon-orders">
            <svg viewBox="0 0 24 24">
              <path
                d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">Pending Acceptance</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-value">
            <svg viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              Rs. {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="stat-label">Total Value</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-capacity">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="8" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M3 8l9-6 9 6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCapacity.toFixed(2)} m³</div>
            <div className="stat-label">Total Capacity</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="store-manager-content">
        <div className="section-header">
          <h3>Orders Ready for Acceptance</h3>
          <p>These orders have arrived by train and are waiting to be accepted into the store</p>
        </div>
        <StoreOrdersTable orders={orders} onAcceptOrder={handleAcceptOrder} loading={loading} />
      </div>
    </div>
  )
}

export default StoreManager
