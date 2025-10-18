import './ReportActions.css';

const ReportActions = ({ onExport }) => {
  const handleExportCSV = () => {
    if (onExport) onExport('csv');
  };

  const handleExportPDF = () => {
    if (onExport) onExport('pdf');
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

      <button
        type="button"
        className="report-overview__button"
        style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}
        onClick={handleExportPDF}
      >
        Download PDF
      </button>
    </div>
  );
};

export default ReportActions;
