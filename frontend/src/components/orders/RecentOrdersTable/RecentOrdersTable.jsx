import './RecentOrdersTable.css'

const RecentOrdersTable = ({ orders, statusTone }) => (
  <section className="orders__table-card">
    <div className="orders__table-header">
      <div className="orders__table-title">
        <h3>Recent Orders</h3>
        <p>Monitor order status and fulfillment progress.</p>
      </div>
      <div className="orders__filters">
        <button type="button" className="orders__filter">All Statuses</button>
        <button type="button" className="orders__filter">Select Date Range</button>
        <button type="button" className="orders__filter">Filter by Route</button>
      </div>
    </div>
    <table className="orders__table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.date}</td>
            <td>
              <span className={`orders__status orders__status--${statusTone[order.status]}`}>
                {order.status}
              </span>
            </td>
            <td>
              <button type="button" className="orders__action">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <footer className="orders__table-footer">
      <p>
        Showing <strong>5</strong> of <strong>25</strong> orders
      </p>
      <div className="orders__pagination">
        <button type="button">Previous</button>
        <span>Page 1 of 2</span>
        <button type="button">Next</button>
      </div>
    </footer>
  </section>
)

export default RecentOrdersTable
