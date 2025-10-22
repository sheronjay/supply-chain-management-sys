import { useState } from 'react';
import './ReportActions.css'

const ReportActions = ({ onExport, onReportTypeChange, currentReportType }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const reportTypes = [
    { value: 'orders', label: 'Orders Report' },
    { value: 'quarterly-sales-value', label: 'Quarterly Sales Report (Value)' },
    { value: 'quarterly-sales-volume', label: 'Quarterly Sales Report (Volume)' },
    { value: 'most-ordered-items', label: 'Most Ordered Items' },
    { value: 'working-hours', label: 'Driver & Assistant Working Hours' },
    { value: 'truck-usage', label: 'Truck Usage Analysis' },
    { value: 'customer-order-history', label: 'Customer Order History' }
  ];

  const handleExportCSV = () => {
    if (onExport) {
      onExport('csv');
    }
  };

  const handleReportTypeSelect = (reportType) => {
    if (onReportTypeChange) {
      onReportTypeChange(reportType);
    }
    setIsDropdownOpen(false);
  };

  const getCurrentReportLabel = () => {
    const report = reportTypes.find(r => r.value === currentReportType);
    return report ? report.label : 'Select Report Type';
  };

  return (
    <div className="report-overview__actions">
      <div className="report-type-dropdown">
        <button 
          type="button" 
          className="report-overview__button report-overview__button--secondary"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {getCurrentReportLabel()} ▼
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                className={`dropdown-item ${currentReportType === type.value ? 'active' : ''}`}
                onClick={() => handleReportTypeSelect(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button 
        type="button" 
        className="report-overview__button"
        onClick={handleExportCSV}
      >
        Download CSV
      </button>
    </div>
  );
};

export default ReportActions
