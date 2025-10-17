import { useState, useEffect } from 'react'
import { fetchTrainSchedules, processOrder } from '../../../services/mainStoresService'
import './ProcessOrderModal.css'

const ProcessOrderModal = ({ order, onClose, onSuccess }) => {
  const [trainSchedules, setTrainSchedules] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTrainSchedules()
  }, [])

  const loadTrainSchedules = async () => {
    try {
      setLoading(true)
      const schedules = await fetchTrainSchedules()
      
      // Filter schedules that match the order's destination store
      const matchingSchedules = schedules.filter(
        schedule => schedule.end_store_id === order.store_id
      )
      
      setTrainSchedules(matchingSchedules)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProcess = async () => {
    if (!selectedSchedule) {
      setError('Please select a train schedule')
      return
    }

    try {
      setProcessing(true)
      setError(null)
      await processOrder(order.order_id, selectedSchedule)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    return timeString.slice(0, 5)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Process Order</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="order-summary">
            <h3>Order Details</h3>
            <div className="order-info">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Destination:</strong> {order.store_city} - {order.sub_city_name}</p>
              <p><strong>Total Price:</strong> Rs. {parseFloat(order.total_price).toFixed(2)}</p>
              <p><strong>Capacity Required:</strong> {parseFloat(order.total_capacity_required).toFixed(2)} units</p>
            </div>
          </div>

          <div className="schedule-selection">
            <h3>Select Train Schedule</h3>
            
            {loading && <p className="loading-message">Loading schedules...</p>}
            
            {error && <div className="error-message">{error}</div>}
            
            {!loading && trainSchedules.length === 0 && (
              <p className="no-schedules">No available train schedules found for this destination.</p>
            )}
            
            {!loading && trainSchedules.length > 0 && (
              <div className="schedules-list">
                {trainSchedules.map((schedule) => {
                  const capacityRequired = parseFloat(order.total_capacity_required)
                  const availableCapacity = parseFloat(schedule.available_capacity)
                  const canFit = capacityRequired <= availableCapacity
                  
                  return (
                    <div
                      key={schedule.trip_id}
                      className={`schedule-item ${!canFit ? 'insufficient-capacity' : ''} ${
                        selectedSchedule === schedule.trip_id ? 'selected' : ''
                      }`}
                      onClick={() => canFit && setSelectedSchedule(schedule.trip_id)}
                    >
                      <div className="schedule-info">
                        <div className="schedule-header-row">
                          <span className="schedule-train">{schedule.train_name}</span>
                          <span className="schedule-date">{formatDate(schedule.day_date)}</span>
                        </div>
                        <div className="schedule-details-row">
                          <span className="schedule-time">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.arrival_time)}
                          </span>
                          <span className="schedule-destination">{schedule.destination_city}</span>
                        </div>
                        <div className="schedule-capacity-row">
                          <span className={`capacity-info ${!canFit ? 'insufficient' : ''}`}>
                            Available: {availableCapacity.toFixed(2)} / {parseFloat(schedule.train_capacity).toFixed(2)} units
                          </span>
                          {!canFit && <span className="insufficient-label">Insufficient Capacity</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={processing}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleProcess} 
            disabled={!selectedSchedule || processing || loading}
          >
            {processing ? 'Processing...' : 'Process Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProcessOrderModal
