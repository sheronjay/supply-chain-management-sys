import { useState } from 'react';
import './ReportFilters.css'

const ReportFilters = ({ filters, onFilterChange }) => {
  const [startDate, setStartDate] = useState(filters.startDate || '');
  const [endDate, setEndDate] = useState(filters.endDate || '');

  const handleApplyFilters = () => {
    onFilterChange({
      startDate,
      endDate
    });
  };

  return (
    <div className="report-overview__filters">
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
