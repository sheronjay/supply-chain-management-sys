import './OrderSummary.css'

const OrderSummary = () => (
  <section className="orders__summary">
    <div className="orders__summary-info">
      <h2>Order Overview</h2>
      <p>Track the latest order volume, fulfillment status, and customer deliveries.</p>
    </div>
    <div className="orders__summary-actions">
      <button type="button" className="orders__button orders__button--secondary">
        Export
      </button>
      <button type="button" className="orders__button orders__button--primary">
        Add New Order
      </button>
    </div>
  </section>
)

export default OrderSummary
