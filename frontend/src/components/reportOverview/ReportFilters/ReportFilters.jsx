import { useState, useEffect } from 'react';
import './ReportFilters.css'

const ReportFilters = ({ filters, onFilterChange, reportType }) => {
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');
  const [year, setYear] = useState(filters.year || new Date().getFullYear());
  const [quarter, setQuarter] = useState(filters.quarter || Math.ceil((new Date().getMonth() + 1) / 3));
  const [month, setMonth] = useState(filters.month || '');
  const [customerId, setCustomerId] = useState(filters.customerId || '');

  // Reset filters when report type changes
  useEffect(() => {
    setStartDate(filters.startDate || '');
    setEndDate(filters.endDate || '');
    setYear(filters.year || new Date().getFullYear());
    setQuarter(filters.quarter || Math.ceil((new Date().getMonth() + 1) / 3));
    setMonth(filters.month || '');
    setCustomerId(filters.customerId || '');
  }, [reportType]);

  const handleApplyFilters = () => {
    const newFilters = {};
    
    // Add relevant filters based on report type
    if (['orders', 'working-hours', 'customer-order-history'].includes(reportType)) {
      newFilters.startDate = startDate;
      newFilters.endDate = endDate;
    }
    
    if (['quarterly-sales-value', 'quarterly-sales-volume', 'truck-usage'].includes(reportType)) {
      newFilters.year = year;
    }
    
    if (reportType === 'most-ordered-items') {
      newFilters.year = year;
      newFilters.quarter = quarter;
    }
    
    if (reportType === 'truck-usage' && month) {
      newFilters.month = month;
    }
    
    if (reportType === 'customer-order-history' && customerId) {
      newFilters.customerId = customerId;
    }
    
    onFilterChange(newFilters);
  };

  // Render different filters based on report type
  const renderFilters = () => {
    switch (reportType) {
      case 'orders':
      case 'working-hours':
        return (
          <>
            <div className="report-overview__filter">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="report-overview__filter">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        );
        
      case 'quarterly-sales-value':
      case 'quarterly-sales-volume':
        return (
          <div className="report-overview__filter">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        );
        
      case 'most-ordered-items':
        return (
          <>
            <div className="report-overview__filter">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="report-overview__filter">
              <label htmlFor="quarter">Quarter</label>
              <select
                id="quarter"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
              >
                <option value="1">Q1 (Jan-Mar)</option>
                <option value="2">Q2 (Apr-Jun)</option>
                <option value="3">Q3 (Jul-Sep)</option>
                <option value="4">Q4 (Oct-Dec)</option>
              </select>
            </div>
          </>
        );
        
      case 'truck-usage':
        return (
          <>
            <div className="report-overview__filter">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="report-overview__filter">
              <label htmlFor="month">Month (Optional)</label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </>
        );
        
      case 'customer-order-history':
        return (
          <>
            <div className="report-overview__filter">
              <label htmlFor="customerId">Customer ID (Optional)</label>
              <input
                id="customerId"
                type="text"
                placeholder="e.g., CUST-001"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>
            <div className="report-overview__filter">
              <label htmlFor="startDate">Start Date (Optional)</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="report-overview__filter">
              <label htmlFor="endDate">End Date (Optional)</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="report-overview__filters">
      {renderFilters()}
      <button
        type="button"
        className="report-overview__apply-btn"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ReportFilters
