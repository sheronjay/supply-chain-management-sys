import { useState } from 'react';
import './RecentOrdersTable.css'

const RecentOrdersTable = ({ orders, statusTone, onViewOrder }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

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
      const orderDate = new Date(order.deliveryDate + 'T00:00:00');
      const startDate = new Date(dateRange.start + 'T00:00:00');
      const endDate = new Date(dateRange.end + 'T00:00:00');
      if (orderDate < startDate || orderDate > endDate) {
        return false;
      }
    }

    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeApply = () => {
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const handleClearDateRange = () => {
    setDateRange({ start: '', end: '' });
    setShowDatePicker(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
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
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
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
          Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> orders
        </p>
        
        {totalPages > 1 && (
          <div className="orders__pagination">
            <button 
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="orders__pagination-btn"
            >
              Previous
            </button>
            
            <div className="orders__pagination-numbers">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="orders__pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`orders__pagination-number ${currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button 
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="orders__pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </footer>
    </section>
  );
};

export default RecentOrdersTable;
