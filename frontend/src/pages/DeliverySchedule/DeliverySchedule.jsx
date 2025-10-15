import { useState, useEffect } from 'react'
import deliveryService from '../../services/deliveryService'
import './DeliverySchedule.css'

const DeliverySchedule = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0
  })

  useEffect(() => {
    fetchDeliveries()
  }, [activeTab])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = activeTab === 'upcoming' 
        ? await deliveryService.getUpcomingDeliveries()
        : await deliveryService.getMyDeliveries()
      
      if (response.success) {
        setDeliveries(response.deliveries)
        calculateStats(response.deliveries)
      }
    } catch (err) {
      setError('Failed to load deliveries. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (deliveryData) => {
    const newStats = {
      pending: deliveryData.filter(d => d.delivery_status === 0).length,
      completed: deliveryData.filter(d => d.delivery_status === 1).length
    }
    
    setStats(newStats)
  }

  const handleMarkAsDelivered = async (deliveryId) => {
    try {
      await deliveryService.updateDeliveryStatus(deliveryId, 1)
      // Refresh the deliveries list to update the UI and stats
      await fetchDeliveries()
    } catch (err) {
      alert('Failed to update delivery status')
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return '--'
    return timeString.substring(0, 5) // HH:MM format
  }

  const getStatusBadge = (deliveryStatus, orderStatus) => {
    if (deliveryStatus === 1) {
      return <span className="delivery-schedule__status-badge delivery-schedule__status-badge--completed">Delivered</span>
    }
    
    switch (orderStatus) {
      case 'DELIVERED':
        return <span className="delivery-schedule__status-badge delivery-schedule__status-badge--delivered">Delivered</span>
      case 'SCHEDULED':
        return <span className="delivery-schedule__status-badge delivery-schedule__status-badge--scheduled">Scheduled</span>
      case 'PLACED':
        return <span className="delivery-schedule__status-badge delivery-schedule__status-badge--placed">Placed</span>
      default:
        return <span className="delivery-schedule__status-badge delivery-schedule__status-badge--pending">Pending</span>
    }
  }

  return (
    <div className="delivery-schedule">
      <div className="delivery-schedule__header">
        <h1 className="delivery-schedule__title">My Delivery Schedule</h1>
        <p className="delivery-schedule__subtitle">
          Manage and track your assigned deliveries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="delivery-schedule__stats">
        <div className="delivery-schedule__stat-card">
          <div className="delivery-schedule__stat-label">Pending</div>
          <div className="delivery-schedule__stat-value delivery-schedule__stat-value--pending">
            {stats.pending}
          </div>
        </div>
        {activeTab === 'all' && (
          <div className="delivery-schedule__stat-card">
            <div className="delivery-schedule__stat-label">Completed</div>
            <div className="delivery-schedule__stat-value delivery-schedule__stat-value--completed">
              {stats.completed}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="delivery-schedule__tabs">
        <button
          className={`delivery-schedule__tab ${activeTab === 'upcoming' ? 'delivery-schedule__tab--active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Deliveries
        </button>
        <button
          className={`delivery-schedule__tab ${activeTab === 'all' ? 'delivery-schedule__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Deliveries
        </button>
      </div>

      {/* Content */}
      <div className="delivery-schedule__content">
        {error && (
          <div className="delivery-schedule__error">{error}</div>
        )}

        {loading ? (
          <div className="delivery-schedule__loading">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="delivery-schedule__empty">
            <div className="delivery-schedule__empty-icon">📦</div>
            <h3>No deliveries found</h3>
            <p>There are no {activeTab === 'upcoming' ? 'upcoming' : ''} deliveries assigned to you at the moment.</p>
          </div>
        ) : (
          <table className="delivery-schedule__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Delivery Date</th>
                <th>Time Slot</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.delivery_id}>
                  <td>
                    <strong>{delivery.order_id}</strong>
                    <div className="delivery-schedule__details">
                      ₹{delivery.total_price ? parseFloat(delivery.total_price).toFixed(2) : '0.00'}
                    </div>
                  </td>
                  <td>
                    <strong>{delivery.customer_name}</strong>
                    <div className="delivery-schedule__details">
                      {delivery.customer_city}
                    </div>
                  </td>
                  <td>{formatDate(delivery.delivered_date)}</td>
                  <td>
                    {formatTime(delivery.vehicle_arrival_time)} - {formatTime(delivery.vehicle_departure_time)}
                  </td>
                  <td>
                    {delivery.end_location || delivery.customer_city}
                    <div className="delivery-schedule__details">
                      {delivery.store_city ? `From ${delivery.store_city}` : ''}
                    </div>
                  </td>
                  <td>{delivery.distance_km ? `${delivery.distance_km} km` : '--'}</td>
                  <td>
                    <div className="delivery-schedule__vehicle">
                      <span className="delivery-schedule__vehicle-icon">🚛</span>
                      {delivery.register_number}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(delivery.delivery_status, delivery.order_status)}
                  </td>
                  <td>
                    {delivery.delivery_status === 0 ? (
                      <button
                        className="delivery-schedule__action-btn"
                        onClick={() => handleMarkAsDelivered(delivery.delivery_id)}
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span style={{ color: '#10B981', fontWeight: 500 }}>✓ Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DeliverySchedule
