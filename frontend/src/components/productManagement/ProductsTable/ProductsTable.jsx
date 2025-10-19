import PropTypes from 'prop-types'
import './ProductsTable.css'

const ProductsTable = ({ products, loading, onRefresh, onUpdate }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-LK').format(number)
  }

  if (loading) {
    return (
      <div className="products-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="products-table-empty">
        <div className="empty-icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h3>No Products Found</h3>
        <p>There are no products in the system yet. Add your first product to get started.</p>
        <button className="btn-add-first" onClick={onRefresh}>
          <svg viewBox="0 0 24 24">
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
    )
  }

  return (
    <div className="products-table-container">
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Space Rate</th>
              <th>Stock Quantity</th>
              <th>Order/Quarter</th>
              <th>Remaining Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td className="product-id">
                  <span className="id-badge">{product.product_id}</span>
                </td>
                <td className="product-name">
                  <div className="name-content">
                    <span className="name-text">{product.product_name}</span>
                  </div>
                </td>
                <td className="unit-price">
                  <span className="price-value">{formatCurrency(product.unit_price)}</span>
                </td>
                <td className="space-rate">
                  <span className="rate-value">{product.space_consumption_rate}</span>
                </td>
                <td className="stock-quantity">
                  <span className={`stock-value ${product.stock_quantity === 0 ? 'out-of-stock' : product.stock_quantity < 50 ? 'low-stock' : ''}`}>
                    {formatNumber(product.stock_quantity)}
                  </span>
                </td>
                <td className="order-quarter">
                  <span className="order-value">{formatNumber(product.order_per_quarter)}</span>
                </td>
                <td className="remaining-items">
                  <span className={`remaining-value ${product.stock_quantity - product.order_per_quarter < 0 ? 'negative' : product.stock_quantity - product.order_per_quarter < 50 ? 'low' : 'good'}`}>
                    {formatNumber(product.stock_quantity - product.order_per_quarter)}
                  </span>
                </td>
                <td className="status">
                  <span className={`status-badge ${product.stock_quantity === 0 ? 'out-of-stock' : product.stock_quantity < 50 ? 'low-stock' : 'in-stock'}`}>
                    {product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity < 50 ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="btn-update" 
                    onClick={() => onUpdate(product)}
                    title="Update Product"
                  >
                    <svg viewBox="0 0 24 24" className="update-icon">
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <div className="table-info">
          <span>Showing {products.length} product{products.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="table-actions">
          <button className="btn-refresh-table" onClick={onRefresh}>
            <svg viewBox="0 0 24 24">
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
      </div>
    </div>
  )
}

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

export default ProductsTable
