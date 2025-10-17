import { useState, useEffect } from 'react'
import { fetchStoreOrders, fetchStoreInventory, acceptOrder, fetchDeliveryEmployees } from '../../services/storeManagerService'
import StoreOrdersTable from '../../components/storeManager/StoreOrdersTable/StoreOrdersTable'
import StoreInventoryTable from '../../components/storeManager/StoreInventoryTable/StoreInventoryTable'
import DeliveryEmployeesTable from '../../components/storeManager/DeliveryEmployeesTable/DeliveryEmployeesTable'
import './StoreManager.css'

const StoreManager = () => {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // For now, hardcode CMB store
  const storeId = 'ST-CMB-01'
  const storeName = 'Colombo Main Store'
  const managerId = 'MGR-CMB-001'

  useEffect(() => {
    if (activeTab === 'orders') {
      loadStoreOrders()
    } else if (activeTab === 'inventory') {
      loadStoreInventory()
    } else if (activeTab === 'employees') {
      loadDeliveryEmployees()
    }
  }, [activeTab])

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

  const loadStoreInventory = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchStoreInventory(storeId)
      setInventory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadDeliveryEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchDeliveryEmployees(storeId)
      setEmployees(data)
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

  const handleRefresh = () => {
    if (activeTab === 'orders') {
      loadStoreOrders()
    } else if (activeTab === 'inventory') {
      loadStoreInventory()
    } else if (activeTab === 'employees') {
      loadDeliveryEmployees()
    }
  }

  const totalOrders = orders.length
  const totalInventory = inventory.length
  const totalEmployees = employees.length

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
            Manage incoming orders and view your current inventory
          </p>
        </div>
        <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
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

      {/* Tabs */}
      <div className="store-manager-tabs">
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <svg viewBox="0 0 24 24" className="tab-icon">
            <path
              d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Pending Orders
          {totalOrders > 0 && <span className="tab-badge">{totalOrders}</span>}
        </button>
        <button
          className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <svg viewBox="0 0 24 24" className="tab-icon">
            <rect x="3" y="8" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 8l9-6 9 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          Inventory
          {totalInventory > 0 && <span className="tab-badge">{totalInventory}</span>}
        </button>
        <button
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <svg viewBox="0 0 24 24" className="tab-icon">
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Delivery Employees
          {totalEmployees > 0 && <span className="tab-badge">{totalEmployees}</span>}
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

      {/* Content based on active tab */}
      <div className="store-manager-content">
        {activeTab === 'orders' ? (
          <>
            <div className="section-header">
              <h3>Orders Ready for Acceptance</h3>
              <p>These orders have arrived by train and are waiting to be accepted into the store</p>
            </div>
            <StoreOrdersTable orders={orders} onAcceptOrder={handleAcceptOrder} loading={loading} />
          </>
        ) : activeTab === 'inventory' ? (
          <>
            <div className="section-header">
              <h3>Current Inventory</h3>
              <p>Orders that are currently in the store (IN-STORE status)</p>
            </div>
            <StoreInventoryTable 
              inventory={inventory} 
              loading={loading} 
              storeId={storeId}
              onRefresh={loadStoreInventory}
            />
          </>
        ) : (
          <>
            <div className="section-header">
              <h3>Delivery Employee Summary</h3>
              <p>View working hours and performance metrics for all delivery staff at this store</p>
            </div>
            <DeliveryEmployeesTable 
              employees={employees} 
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default StoreManager
