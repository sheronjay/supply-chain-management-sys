import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './UpdateProductModal.css'

const UpdateProductModal = ({ isOpen, onClose, onUpdate, product }) => {
  const [formData, setFormData] = useState({
    productName: '',
    unitPrice: '',
    spaceConsumptionRate: '',
    stockQuantity: '',
    orderPerQuarter: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.product_name || '',
        unitPrice: product.unit_price || '',
        spaceConsumptionRate: product.space_consumption_rate || '',
        stockQuantity: product.stock_quantity || '',
        orderPerQuarter: product.order_per_quarter || ''
      })
    }
  }, [product])

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

    if (!formData.stockQuantity || parseInt(formData.stockQuantity, 10) < 0) {
      setError('Stock quantity must be a non-negative integer')
      return
    }

    // Check if stock quantity is being reduced
    const newStock = parseInt(formData.stockQuantity, 10)
    const currentStock = product.stock_quantity
    if (newStock < currentStock) {
      setError(`Cannot reduce stock quantity. Current stock is ${currentStock}. You can only increase the quantity.`)
      return
    }

    if (formData.orderPerQuarter === '' || parseInt(formData.orderPerQuarter, 10) < 0) {
      setError('Order per quarter must be a non-negative integer')
      return
    }

    setIsSubmitting(true)
    try {
      await onUpdate({
        productId: product.product_id,
        productName: formData.productName.trim(),
        unitPrice: parseFloat(formData.unitPrice),
        spaceConsumptionRate: parseFloat(formData.spaceConsumptionRate),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        orderPerQuarter: parseInt(formData.orderPerQuarter, 10)
      })
      
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError('')
      setIsSubmitting(false)
      onClose()
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="update-product-modal-overlay" onClick={handleClose}>
      <div className="update-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Product</h2>
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
                <div className="stock-input-container">
                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min={product.stock_quantity}
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="form-input"
                    disabled={isSubmitting}
                    required
                  />
                  <div className="stock-info">
                    <span className="current-stock">Current: {product.stock_quantity}</span>
                    <span className="min-stock">Min: {product.stock_quantity}</span>
                  </div>
                </div>
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
                  disabled={isSubmitting}
                  required
                />
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
                <span className="info-value">{product.product_id}</span>
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
                  Updating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="submit-icon">
                    <path
                      d="M20 6L9 17l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

UpdateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  product: PropTypes.object
}

export default UpdateProductModal

