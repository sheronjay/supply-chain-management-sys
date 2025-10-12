import './ReportActions.css'

const ReportActions = () => (
  <div className="report-overview__actions">
    <button type="button" className="report-overview__button">Export PDF</button>
    <button type="button" className="report-overview__button report-overview__button--secondary">
      Download CSV
    </button>
  </div>
)

export default ReportActions
