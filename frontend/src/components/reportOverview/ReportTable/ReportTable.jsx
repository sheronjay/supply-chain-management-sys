import './ReportTable.css'

const ReportTable = ({ orders, loading, summary }) => {
  if (loading) {
    return (
      <section className="report-overview__card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading reports...</p>
        </div>
      </section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="report-overview__card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No orders found for the selected filters.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="report-overview__card">
      {summary && (
        <div className="report-overview__summary">
          <div className="summary-item">
            <span className="summary-label">Total Orders:</span>
            <span className="summary-value">{summary.total_orders || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Revenue:</span>
            <span className="summary-value">
              Rs. {Number(summary.total_revenue || 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg Order Value:</span>
            <span className="summary-value">
              Rs. {Number(summary.avg_order_value || 0).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Customers:</span>
            <span className="summary-value">{summary.total_customers || 0}</span>
          </div>
        </div>
      )}

      <table className="report-overview__table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Store</th>
            <th>Delivery Location</th>
            <th>Status</th>
            <th>Total</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{new Date(order.ordered_date).toLocaleDateString()}</td>
              <td>
                <div>{order.customer_name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.customer_email}</div>
              </td>
              <td>{order.store}</td>
              <td>{order.delivery_location}</td>
              <td>
                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>Rs. {Number(order.total_price || 0).toLocaleString()}</td>
              <td style={{ fontSize: '0.875rem' }}>{order.products || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="report-overview__footer">
        <span>Showing {orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </footer>
    </section>
  );
};

export default ReportTable
