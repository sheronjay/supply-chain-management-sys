import { useState } from 'react';
import './RecentOrdersTable.css'

const RecentOrdersTable = ({ orders, statusTone, onViewOrder }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get unique statuses from orders
  const uniqueStatuses = ['ALL', ...new Set(orders.map(order => order.status))];

  // Filter orders based on selected filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.deliveryDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    return true;
  });

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateRangeApply = () => {
    setShowDatePicker(false);
  };

  const handleClearDateRange = () => {
    setDateRange({ start: '', end: '' });
    setShowDatePicker(false);
  };

  return (
    <section className="orders__table-card">
      <div className="orders__table-header">
        <div className="orders__table-title">
          <h3>Recent Orders</h3>
          <p>Monitor order status and fulfillment progress.</p>
        </div>
        <div className="orders__filters">
          <select 
            className="orders__filter" 
            value={statusFilter} 
            onChange={handleStatusChange}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
          
          <div className="orders__date-filter">
            <button 
              type="button" 
              className="orders__filter"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {dateRange.start && dateRange.end 
                ? `${dateRange.start} to ${dateRange.end}` 
                : 'Select Date Range'}
            </button>
            
            {showDatePicker && (
              <div className="orders__date-picker">
                <label>
                  Start Date:
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </label>
                <label>
                  End Date:
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </label>
                <div className="orders__date-picker-actions">
                  <button onClick={handleDateRangeApply}>Apply</button>
                  <button onClick={handleClearDateRange}>Clear</button>
                </div>
              </div>
            )}
          </div>
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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
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
                  <button 
                    type="button" 
                    className="orders__action"
                    onClick={() => onViewOrder(order.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                No orders found matching the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <footer className="orders__table-footer">
        <p>
          Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
        </p>
      </footer>
    </section>
  );
};

export default RecentOrdersTable;
