import './ReportActions.css'

const ReportActions = ({ onExport }) => {
  const handleExportCSV = () => {
    if (onExport) {
      onExport('csv');
    }
  };

  return (
    <div className="report-overview__actions">
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
