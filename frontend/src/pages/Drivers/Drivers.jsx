import { useState, useEffect } from 'react'
import { driverService } from '../../services/driverService'
import AssignedOrdersTable from '../../components/driver/AssignedOrdersTable/AssignedOrdersTable'
import WorkingHoursModal from '../../components/driver/WorkingHoursModal/WorkingHoursModal'
import './Drivers.css'

const Drivers = () => {
  const [orders, setOrders] = useState([])
  const [driverDetails, setDriverDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false)

  // For now, hardcode a driver ID - in production this would come from auth context
  const driverId = 'USR-DRV-01'

  useEffect(() => {
    loadDriverData()
  }, [])

  const loadDriverData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [ordersData, detailsData] = await Promise.all([
        driverService.getDriverOrders(driverId),
        driverService.getDriverDetails(driverId)
      ])
      
      setOrders(ordersData)
      setDriverDetails(detailsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDelivered = async (orderId) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      await driverService.markOrderAsDelivered(orderId, driverId)
      
      // Show success message
      setSuccessMessage(`Order ${orderId} marked as delivered successfully!`)
      
      // Reload orders to reflect the status change
      const ordersData = await driverService.getDriverOrders(driverId)
      setOrders(ordersData)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err.message)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  }

  const handleUpdateWorkingHours = async (hours) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      await driverService.updateWorkingHours(driverId, hours)
      
      // Show success message
      setSuccessMessage(`Working hours updated to ${hours} hours successfully!`)
      
      // Reload driver details to get updated hours
      const detailsData = await driverService.getDriverDetails(driverId)
      setDriverDetails(detailsData)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err.message)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
      throw err // Re-throw to let modal handle it
    }
  }

  const handleRefresh = () => {
    loadDriverData()
  }

  const pendingOrders = orders.filter(order => order.status === 'TRUCK')
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED')
  const workingHours = parseFloat(driverDetails?.working_hours || 0)
  const isOverLimit = workingHours >= 40

  return (
    <div className="drivers-page">
      <div className="drivers-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Driver Dashboard</h1>
            {driverDetails && (
              <p className="driver-info">
                {driverDetails.name} - {driverDetails.store_city} Store
              </p>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="btn-working-hours"
              onClick={() => setIsHoursModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" className="hours-icon">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
              </svg>
              Update Hours
            </button>
            <button className="btn-refresh" onClick={handleRefresh}>
              <svg viewBox="0 0 24 24" className="refresh-icon">
                <path
                  d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Working Hours Info Card */}
        {driverDetails && (
          <div className={`hours-card ${isOverLimit ? 'warning' : ''}`}>
            <div className="hours-card-content">
              <div className="hours-info-section">
                <span className="hours-label">Working Hours This Week</span>
                <span className="hours-value">{workingHours} / 40 hours</span>
              </div>
              <div className="hours-status">
                {isOverLimit ? (
                  <>
                    <svg viewBox="0 0 24 24" className="status-icon warning">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="status-text warning">Weekly limit reached</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="status-icon success">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="status-text success">Within limit</span>
                  </>
                )}
              </div>
            </div>
            <div className="hours-progress">
              <div 
                className={`hours-progress-bar ${isOverLimit ? 'warning' : ''}`}
                style={{ width: `${Math.min((workingHours / 40) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon pending">
              <svg viewBox="0 0 24 24">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Pending Deliveries</span>
              <span className="stat-value">{pendingOrders.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon delivered">
              <svg viewBox="0 0 24 24">
                <polyline
                  points="20 6 9 17 4 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{deliveredOrders.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <svg viewBox="0 0 24 24" className="alert-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <svg viewBox="0 0 24 24" className="alert-icon">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="alert-close">×</button>
        </div>
      )}

      {/* Orders Table */}
      <div className="drivers-content">
        <div className="content-header">
          <h2>Assigned Orders</h2>
          <p className="content-description">
            View all orders assigned to you. Mark orders as delivered once completed.
          </p>
        </div>
        <AssignedOrdersTable
          orders={orders}
          onMarkDelivered={handleMarkDelivered}
          loading={loading}
        />
      </div>

      {/* Working Hours Modal */}
      <WorkingHoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        currentHours={workingHours}
        onUpdate={handleUpdateWorkingHours}
      />
    </div>
  )
}

export default Drivers
