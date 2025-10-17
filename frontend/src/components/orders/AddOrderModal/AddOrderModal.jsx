import { useState, useEffect } from "react";
import "./AddOrderModal.css";

const AddOrderModal = ({ isOpen, onClose, onCreate, customerName }) => {
  const [formData, setFormData] = useState({
    route: "",
    items: [{ name: "", qty: 1, price: 0 }],
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/products/list');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // If product name changes, update the price from products list
    if (field === 'name' && products.length > 0) {
      const product = products.find(p => p.product_name === value);
      if (product) {
        updatedItems[index].price = parseFloat(product.unit_price);
      }
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", qty: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.route.trim()) {
      alert("Please select a route");
      return;
    }

    const validItems = formData.items.filter(item => 
      item.name.trim() && item.qty > 0 && item.price > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one valid item");
      return;
    }

    setLoading(true);
    
    try {
      const totalAmount = calculateTotal();
      await onCreate({
        route: formData.route,
        items: validItems,
        totalAmount,
      });

      // Reset form
      setFormData({
        route: "",
        items: [{ name: "", qty: 1, price: 0 }],
      });
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Order</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="customer-info-display">
            <p><strong>Customer:</strong> {customerName}</p>
          </div>

          <div className="form-group">
            <label htmlFor="route">Delivery Sub-City *</label>
            <select
              id="route"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a sub-city</option>
              <optgroup label="Colombo">
                <option value="Pettah">Pettah</option>
                <option value="Thimbirigasyaya">Thimbirigasyaya</option>
                <option value="Dehiwala">Dehiwala</option>
              </optgroup>
              <optgroup label="Kandy">
                <option value="Peradeniya">Peradeniya</option>
                <option value="Katugastota">Katugastota</option>
                <option value="Gampola">Gampola</option>
              </optgroup>
              <optgroup label="Negombo">
                <option value="Kochchikade">Kochchikade</option>
                <option value="Katana">Katana</option>
                <option value="Wattala">Wattala</option>
              </optgroup>
              <optgroup label="Galle">
                <option value="Unawatuna">Unawatuna</option>
                <option value="Hikkaduwa">Hikkaduwa</option>
                <option value="Ambalangoda">Ambalangoda</option>
              </optgroup>
              <optgroup label="Matara">
                <option value="Weligama">Weligama</option>
                <option value="Hakmana">Hakmana</option>
                <option value="Dikwella">Dikwella</option>
              </optgroup>
              <optgroup label="Jaffna">
                <option value="Nallur">Nallur</option>
                <option value="Chavakachcheri">Chavakachcheri</option>
              </optgroup>
              <optgroup label="Trincomalee">
                <option value="Uppuveli">Uppuveli</option>
                <option value="Kinniya">Kinniya</option>
              </optgroup>
            </select>
          </div>

          <div className="items-section">
            <h3>Order Items</h3>
            {formData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="form-group">
                  <label>Product *</label>
                  {products.length > 0 ? (
                    <select
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.product_id} value={product.product_name}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      placeholder="Product name"
                      required
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (LKR) *</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    required
                    disabled={products.length > 0}
                  />
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="text"
                    value={`LKR ${(item.qty * item.price).toFixed(2)}`}
                    disabled
                    className="amount-field"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="remove-item-btn"
                  disabled={formData.items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}

            <button type="button" onClick={addItem} className="add-item-btn">
              + Add Item
            </button>
          </div>

          <div className="total-section">
            <strong>Total Amount: LKR {calculateTotal().toFixed(2)}</strong>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
