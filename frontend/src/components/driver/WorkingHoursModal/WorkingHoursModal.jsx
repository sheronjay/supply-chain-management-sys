import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './WorkingHoursModal.css'

const WorkingHoursModal = ({ isOpen, onClose, currentHours, onUpdate }) => {
  const [hoursToAdd, setHoursToAdd] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setHoursToAdd('')
      setError('')
    }
  }, [isOpen, currentHours])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const hoursNum = parseFloat(hoursToAdd)
    if (isNaN(hoursNum) || hoursNum <= 0) {
      setError('Please enter a valid positive number of hours to add')
      return
    }

    if (hoursNum > 40) {
      setError('Cannot add more than 40 hours at once')
      return
    }

    const newTotal = (currentHours || 0) + hoursNum
    if (newTotal > 40) {
      setError(`Cannot add ${hoursNum} hours. This would exceed the weekly limit of 40 hours. Current: ${currentHours || 0}, would become: ${newTotal}`)
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate(newTotal)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add working hours')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="working-hours-modal-overlay" onClick={onClose}>
      <div className="working-hours-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Working Hours</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="hours-to-add">
                Hours to Add
                <span className="label-hint">(Current: {currentHours || 0} hours)</span>
              </label>
              <input
                id="hours-to-add"
                type="number"
                step="0.5"
                min="0.5"
                max="40"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(e.target.value)}
                placeholder="Enter hours to add"
                className="hours-input"
                autoFocus
              />
              <div className="input-hint">
                Enter the number of hours you want to add to your weekly total
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
                <span className="info-label">Current Hours:</span>
                <span className="info-value">{currentHours || 0} / 40 hours</span>
              </div>
              <div className="info-item">
                <span className="info-label">After Adding:</span>
                <span className={`info-value ${(currentHours || 0) + parseFloat(hoursToAdd || 0) >= 40 ? 'warning' : 'normal'}`}>
                  {(currentHours || 0) + parseFloat(hoursToAdd || 0)} / 40 hours
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${(currentHours || 0) >= 40 ? 'warning' : 'normal'}`}>
                  {(currentHours || 0) >= 40 ? 'Limit Reached' : 'Can Add More'}
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
              disabled={isSubmitting || !hoursToAdd || parseFloat(hoursToAdd) <= 0}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="submit-icon">
                    <path
                      d="M12 5v14M5 12h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Add Hours
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
