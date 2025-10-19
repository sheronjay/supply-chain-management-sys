import { useState } from 'react'
import PropTypes from 'prop-types'
import './AddProductModal.css'

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    productName: '',
    unitPrice: '',
    spaceConsumptionRate: '',
    stockQuantity: '',
    orderPerQuarter: '0'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.productName.trim()) {
      setError('Product name is required')
      return
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('Unit price must be a positive number')
      return
    }

    if (!formData.spaceConsumptionRate || parseFloat(formData.spaceConsumptionRate) <= 0) {
      setError('Space consumption rate must be a positive number')
      return
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      setError('Stock quantity must be a non-negative integer')
      return
    }

    if (formData.orderPerQuarter === '' || parseInt(formData.orderPerQuarter) < 0) {
      setError('Order per quarter must be a non-negative integer')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        productName: formData.productName.trim(),
        unitPrice: parseFloat(formData.unitPrice),
        spaceConsumptionRate: parseFloat(formData.spaceConsumptionRate),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        orderPerQuarter: parseInt(formData.orderPerQuarter, 10)
      })
      
      // Reset form only after successful addition
      setFormData({
        productName: '',
        unitPrice: '',
        spaceConsumptionRate: '',
        stockQuantity: '',
        orderPerQuarter: '0'
      })
      setError('') // Clear any previous errors
    } catch (err) {
      setError(err.message || 'Failed to add product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      // Reset form data
      setFormData({
        productName: '',
        unitPrice: '',
        spaceConsumptionRate: '',
        stockQuantity: '',
        orderPerQuarter: '0'
      })
      setError('')
      setIsSubmitting(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-product-modal-overlay" onClick={handleClose}>
      <div className="add-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-button" onClick={handleClose} aria-label="Close modal" disabled={isSubmitting}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="productName">
                Product Name *
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="form-input"
                autoFocus
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitPrice">
                  Unit Price (Rs.) *
                </label>
                <input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="form-input"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="spaceConsumptionRate">
                  Space Consumption Rate *
                </label>
                <input
                  id="spaceConsumptionRate"
                  name="spaceConsumptionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.spaceConsumptionRate}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="form-input"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stockQuantity">
                  Stock Quantity *
                </label>
                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="form-input"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="orderPerQuarter">
                  Order Per Quarter
                </label>
                <input
                  id="orderPerQuarter"
                  name="orderPerQuarter"
                  type="number"
                  min="0"
                  value={formData.orderPerQuarter}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="form-input"
                  disabled={true}
                  readOnly
                />
                <div className="field-note">
                  This will be automatically updated based on actual orders
                </div>
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

            <div className="form-info">
              <div className="info-item">
                <span className="info-label">Note:</span>
                <span className="info-value">All fields marked with * are required</span>
              </div>
              <div className="info-item">
                <span className="info-label">Product ID:</span>
                <span className="info-value">Will be auto-generated</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || !formData.productName.trim()}
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
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default AddProductModal
