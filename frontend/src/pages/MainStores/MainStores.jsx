import { useState, useEffect } from 'react'
import { fetchPendingOrders } from '../../services/mainStoresService'
import PendingOrdersTable from '../../components/mainStores/PendingOrdersTable/PendingOrdersTable'
import './MainStores.css'

const MainStores = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPendingOrders()
  }, [])

  const loadPendingOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPendingOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-stores">
      <div className="main-stores-header">
        <div>
          <h2>Main Stores - Order Processing</h2>
          <p>Process pending orders and assign them to train schedules</p>
        </div>
        <button className="btn-refresh" onClick={loadPendingOrders} disabled={loading}>
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

      <div className="main-stores-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon-pending">
            <svg viewBox="0 0 24 24">
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-capacity">
            <svg viewBox="0 0 24 24">
              <rect x="6" y="5" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M6 13h12M9 5V3h6v2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {orders.reduce((sum, order) => sum + parseFloat(order.total_capacity_required || 0), 0).toFixed(2)}
            </div>
            <div className="stat-label">Total Capacity Required</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-value">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              Rs. {orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0).toFixed(2)}
            </div>
            <div className="stat-label">Total Order Value</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <svg viewBox="0 0 24 24" className="error-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div>
            <strong>Error loading orders</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading pending orders...</p>
        </div>
      ) : (
        <PendingOrdersTable orders={orders} onRefresh={loadPendingOrders} />
      )}
    </div>
  )
}

export default MainStores
