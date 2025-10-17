import * as reportService from '../../services/report.service.js';

/**
 * Get orders report with filters
 * @route GET /api/reports
 */
export const getReports = async (req, res) => {
  try {
    const { 
      startDate,
      endDate,
      storeId
    } = req.query;

    // Set default date range if not provided (last 30 days)
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Use the storeId from query params (sent by frontend based on logged-in user)
    const filterStoreId = storeId || null;

    const reports = await reportService.getOrdersReport(start, end, filterStoreId);
    const summary = await reportService.getReportSummary(start, end, filterStoreId);

    res.json({
      success: true,
      data: {
        orders: reports,
        summary,
        filters: {
          startDate: start,
          endDate: end,
          storeId: filterStoreId
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

/**
 * Get report summary
 * @route GET /api/reports/summary
 */
export const getReportSummary = async (req, res) => {
  try {
    const { startDate, endDate, storeId } = req.query;

    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Use the storeId from query params (sent by frontend based on logged-in user)
    const filterStoreId = storeId || null;

    const summary = await reportService.getReportSummary(start, end, filterStoreId);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching report summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report summary',
      error: error.message
    });
  }
};
