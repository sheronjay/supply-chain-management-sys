import { useState, useEffect } from 'react'
import { fetchAllProducts, addNewProduct, updateProduct } from '../../services/mainStoresService'
import AddProductModal from '../../components/productManagement/AddProductModal/AddProductModal'
import UpdateProductModal from '../../components/productManagement/UpdateProductModal/UpdateProductModal'
import ProductsTable from '../../components/productManagement/ProductsTable/ProductsTable'
import './ProductManagement.css'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      const result = await addNewProduct(productData)
      
      // Show success message
      setSuccessMessage(`Product "${result.product.product_name}" added successfully!`)
      
      // Reload products to show the new one
      await loadProducts()
      
      // Close modal
      setIsAddModalOpen(false)
      
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
    loadProducts()
  }

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product)
    setIsUpdateModalOpen(true)
  }

  const handleUpdate = async (productData) => {
    try {
      setError(null)
      setSuccessMessage(null)
      
      const result = await updateProduct(productData)
      
      // Show success message
      setSuccessMessage(`Product "${result.product.product_name}" updated successfully!`)
      
      // Reload products to show the updated one
      await loadProducts()
      
      // Close modal
      setIsUpdateModalOpen(false)
      setSelectedProduct(null)
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err) {
      setError(err.message)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
      throw err // Re-throw to let modal handle it
    }
  }


  return (
    <div className="product-management">
      <div className="product-management-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Product Management</h1>
            <p>Manage products in the system - add new products and view all existing products</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn-add-product"
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" className="add-icon">
                <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Add New Product
            </button>
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
        </div>

        {/* Statistics Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon total">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{products.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stock">
              <svg viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M9 22V12h6v10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Stock</span>
              <span className="stat-value">
                {products.reduce((sum, product) => sum + (product.stock_quantity || 0), 0)}
              </span>
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

      {/* Products Table */}
      <div className="product-management-content">
        <div className="content-header">
          <h2>All Products</h2>
          <p className="content-description">
            View and manage all products in the system. Click "Add New Product" to add new items.
          </p>
        </div>
        <ProductsTable
          products={products}
          loading={loading}
          onRefresh={handleRefresh}
          onUpdate={handleUpdateProduct}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      {/* Update Product Modal */}
      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setSelectedProduct(null)
        }}
        onUpdate={handleUpdate}
        product={selectedProduct}
      />
    </div>
  )
}

export default ProductManagement

