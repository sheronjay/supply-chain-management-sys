import './ReportTable.css'

const ReportTable = ({ data, loading, summary, reportType }) => {
  if (loading) {
    return (
      <section className="report-overview__card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading reports...</p>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="report-overview__card">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No data found for the selected report.</p>
        </div>
      </section>
    );
  }

  // Render different tables based on report type
  const renderTable = () => {
    switch (reportType) {
      case 'orders':
        return renderOrdersTable(data, summary);
      case 'quarterly-sales-value':
        return renderQuarterlySalesValueTable(data);
      case 'quarterly-sales-volume':
        return renderQuarterlySalesVolumeTable(data);
      case 'most-ordered-items':
        return renderMostOrderedItemsTable(data);
      case 'working-hours':
        return renderWorkingHoursTable(data);
      case 'truck-usage':
        return renderTruckUsageTable(data);
      case 'customer-order-history':
        return renderCustomerOrderHistoryTable(data);
      default:
        return <p>Unknown report type</p>;
    }
  };

  const renderOrdersTable = (orders, summary) => (
    <>
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
    </>
  );

  const renderQuarterlySalesValueTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Year</th>
          <th>Total Revenue</th>
          <th>Order Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>Q{row.quarter}</td>
            <td>{row.year}</td>
            <td>Rs. {Number(row.total_revenue || 0).toLocaleString()}</td>
            <td>{row.order_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderQuarterlySalesVolumeTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Year</th>
          <th>Total Quantity</th>
          <th>Order Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>Q{row.quarter}</td>
            <td>{row.year}</td>
            <td>{Number(row.total_quantity || 0).toLocaleString()} units</td>
            <td>{row.order_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderMostOrderedItemsTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Total Quantity</th>
          <th>Order Count</th>
          <th>Total Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.product_id}>
            <td>{item.product_id}</td>
            <td>{item.product_name}</td>
            <td>{Number(item.total_quantity || 0).toLocaleString()} units</td>
            <td>{item.order_count}</td>
            <td>Rs. {Number(item.total_revenue || 0).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderWorkingHoursTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Designation</th>
          <th>Store</th>
          <th>Total Hours Worked</th>
        </tr>
      </thead>
      <tbody>
        {data.map((employee) => (
          <tr key={employee.user_id}>
            <td>{employee.user_id}</td>
            <td>{employee.name}</td>
            <td>{employee.designation}</td>
            <td>{employee.store_city}</td>
            <td>{Number(employee.total_hours_worked || 0).toFixed(2)} hrs</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderTruckUsageTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Truck ID</th>
          <th>Registration</th>
          <th>Store</th>
          <th>Capacity</th>
          <th>Used Hours</th>
          <th>Total Deliveries</th>
        </tr>
      </thead>
      <tbody>
        {data.map((truck, index) => (
          <tr key={`${truck.truck_id}-${index}`}>
            <td>{truck.truck_id}</td>
            <td>{truck.reg_number}</td>
            <td>{truck.store_city}</td>
            <td>{Number(truck.capacity || 0).toFixed(2)}</td>
            <td>{Number(truck.used_hours || 0).toFixed(2)} hrs</td>
            <td>{truck.total_deliveries}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCustomerOrderHistoryTable = (data) => (
    <table className="report-overview__table">
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Customer Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Order ID</th>
          <th>Order Date</th>
          <th>Status</th>
          <th>Total Price</th>
          <th>Products</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={`${row.customer_id}-${row.order_id}-${index}`}>
            <td>{row.customer_id}</td>
            <td>{row.customer_name}</td>
            <td style={{ fontSize: '0.875rem' }}>{row.email}</td>
            <td>{row.phone_number}</td>
            <td>{row.order_id}</td>
            <td>{row.ordered_date ? new Date(row.ordered_date).toLocaleDateString() : 'N/A'}</td>
            <td>
              {row.status && (
                <span className={`status-badge status-${row.status?.toLowerCase()}`}>
                  {row.status}
                </span>
              )}
            </td>
            <td>Rs. {Number(row.total_price || 0).toLocaleString()}</td>
            <td style={{ fontSize: '0.875rem' }}>{row.products || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className="report-overview__card">
      {renderTable()}
      <footer className="report-overview__footer">
        <span>Showing {data.length} record{data.length !== 1 ? 's' : ''}</span>
      </footer>
    </section>
  );
};

export default ReportTable
