import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchTrucks, fetchDrivers, fetchAssistants, assignOrderToTruck } from '../../../services/storeManagerService'
import './AssignTruckModal.css'

const AssignTruckModal = ({ isOpen, onClose, order, storeId, onSuccess }) => {
  const [trucks, setTrucks] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assistants, setAssistants] = useState([])
  const [selectedTruck, setSelectedTruck] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedAssistant, setSelectedAssistant] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isOpen && storeId) {
      loadData()
    }
  }, [isOpen, storeId])

  const loadData = async () => {
    try {
      setLoadingData(true)
      setError(null)
      
      const [trucksData, driversData, assistantsData] = await Promise.all([
        fetchTrucks(storeId),
        fetchDrivers(storeId),
        fetchAssistants(storeId)
      ])
      
      setTrucks(trucksData)
      setDrivers(driversData)
      setAssistants(assistantsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedTruck || !selectedDriver || !selectedAssistant) {
      setError('Please select truck, driver, and assistant')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      await assignOrderToTruck(order.order_id, selectedTruck, selectedDriver, selectedAssistant)
      
      // Reset form
      setSelectedTruck('')
      setSelectedDriver('')
      setSelectedAssistant('')
      
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedTruck('')
    setSelectedDriver('')
    setSelectedAssistant('')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="assign-truck-modal-overlay" onClick={handleClose}>
      <div className="assign-truck-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="assign-truck-modal-header">
          <h2>Assign Truck for Delivery</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="assign-truck-modal-body">
          {order && (
            <div className="order-info">
              <h3>Order Details</h3>
              <div className="order-info-grid">
                <div className="order-info-item">
                  <span className="label">Order ID:</span>
                  <span className="value">{order.order_id}</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Customer:</span>
                  <span className="value">{order.customer_name}</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Sub-City:</span>
                  <span className="value">{order.sub_city_name}</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Capacity Required:</span>
                  <span className="value">{parseFloat(order.total_capacity_required || 0).toFixed(2)} m³</span>
                </div>
              </div>
            </div>
          )}

          {loadingData ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="assign-form">
              {error && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" className="error-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="truck">Select Truck *</label>
                <select
                  id="truck"
                  value={selectedTruck}
                  onChange={(e) => setSelectedTruck(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Select a truck --</option>
                  {trucks.map((truck) => (
                    <option key={truck.truck_id} value={truck.truck_id}>
                      {truck.reg_number} - Capacity: {truck.capacity} m³ (Used: {truck.used_hours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="driver">Select Driver *</label>
                <select
                  id="driver"
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Select a driver --</option>
                  {drivers.map((driver) => (
                    <option 
                      key={driver.user_id} 
                      value={driver.user_id}
                      disabled={driver.can_assign === 0}
                      className={driver.can_assign === 0 ? 'disabled-option' : ''}
                    >
                      {driver.name} - {driver.working_hours}h worked
                      {driver.can_assign === 0 ? ' (40+ hours)' : ''}
                    </option>
                  ))}
                </select>
                <p className="form-hint">Drivers with 40+ working hours cannot be assigned but are still shown.</p>
              </div>

              <div className="form-group">
                <label htmlFor="assistant">Select Assistant *</label>
                <select
                  id="assistant"
                  value={selectedAssistant}
                  onChange={(e) => setSelectedAssistant(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Select an assistant --</option>
                  {assistants.map((assistant) => (
                    <option 
                      key={assistant.user_id} 
                      value={assistant.user_id}
                      disabled={assistant.can_assign === 0}
                      className={assistant.can_assign === 0 ? 'disabled-option' : ''}
                    >
                      {assistant.name} - {assistant.working_hours}h worked
                      {assistant.can_assign === 0 ? ' (40+ hours)' : ''}
                    </option>
                  ))}
                </select>
                <p className="form-hint">Assistants with 40+ working hours cannot be assigned but are still shown.</p>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-assign" 
                  disabled={loading || !selectedTruck || !selectedDriver || !selectedAssistant}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Assigning...
                    </>
                  ) : (
                    'Assign Truck'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

AssignTruckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    customer_name: PropTypes.string,
    sub_city_name: PropTypes.string,
    total_capacity_required: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  storeId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default AssignTruckModal
