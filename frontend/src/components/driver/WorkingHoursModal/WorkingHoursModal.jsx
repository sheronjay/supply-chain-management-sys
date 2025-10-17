import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './WorkingHoursModal.css'

const WorkingHoursModal = ({ isOpen, onClose, currentHours, onUpdate }) => {
  const [hours, setHours] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setHours(currentHours?.toString() || '0')
      setError('')
    }
  }, [isOpen, currentHours])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const hoursNum = parseFloat(hours)
    if (isNaN(hoursNum) || hoursNum < 0) {
      setError('Please enter a valid positive number')
      return
    }

    if (hoursNum > 168) {
      setError('Working hours cannot exceed 168 hours per week')
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate(hoursNum)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update working hours')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="working-hours-modal-overlay" onClick={onClose}>
      <div className="working-hours-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Working Hours</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="working-hours">
                Total Working Hours
                <span className="label-hint">(Current: {currentHours} hours)</span>
              </label>
              <input
                id="working-hours"
                type="number"
                step="0.5"
                min="0"
                max="168"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Enter total hours worked"
                className="hours-input"
                autoFocus
              />
              <div className="input-hint">
                Enter the total number of hours you have worked this week
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" className="error-icon">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" />
                </svg>
                {error}
              </div>
            )}

            <div className="hours-info">
              <div className="info-item">
                <span className="info-label">Weekly Limit:</span>
                <span className="info-value">40 hours</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${parseFloat(hours) >= 40 ? 'warning' : 'normal'}`}>
                  {parseFloat(hours) >= 40 ? 'Limit Reached' : 'Within Limit'}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Updating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="submit-icon">
                    <polyline
                      points="20 6 9 17 4 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Update Hours
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

WorkingHoursModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentHours: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
}

export default WorkingHoursModal
