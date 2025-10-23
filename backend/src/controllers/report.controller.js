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

/**
 * Get quarterly sales report by value
 * @route GET /api/reports/quarterly-sales-value
 */
export const getQuarterlySalesValue = async (req, res) => {
  try {
    const { year, storeId } = req.query;
    const reportYear = year || new Date().getFullYear();
    const filterStoreId = storeId || null;

    const data = await reportService.getQuarterlySalesValue(reportYear, filterStoreId);
    
    res.json({
      success: true,
      data: data,
      filters: { year: reportYear, storeId: filterStoreId }
    });
  } catch (error) {
    console.error('Error fetching quarterly sales value report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quarterly sales value report',
      error: error.message
    });
  }
};

/**
 * Get quarterly sales report by volume
 * @route GET /api/reports/quarterly-sales-volume
 */
export const getQuarterlySalesVolume = async (req, res) => {
  try {
    const { year, storeId } = req.query;
    const reportYear = year || new Date().getFullYear();
    const filterStoreId = storeId || null;

    const data = await reportService.getQuarterlySalesVolume(reportYear, filterStoreId);
    
    res.json({
      success: true,
      data: data,
      filters: { year: reportYear, storeId: filterStoreId }
    });
  } catch (error) {
    console.error('Error fetching quarterly sales volume report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quarterly sales volume report',
      error: error.message
    });
  }
};

/**
 * Get most ordered items in a quarter
 * @route GET /api/reports/most-ordered-items
 */
export const getMostOrderedItems = async (req, res) => {
  try {
    const { year, quarter, storeId } = req.query;
    const reportYear = year || new Date().getFullYear();
    const reportQuarter = quarter || Math.ceil((new Date().getMonth() + 1) / 3);
    const filterStoreId = storeId || null;

    const data = await reportService.getMostOrderedItems(reportYear, reportQuarter, filterStoreId);
    
    res.json({
      success: true,
      data: data,
      filters: { year: reportYear, quarter: reportQuarter, storeId: filterStoreId }
    });
  } catch (error) {
    console.error('Error fetching most ordered items report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch most ordered items report',
      error: error.message
    });
  }
};

/**
 * Get driver and assistant working hours report
 * @route GET /api/reports/working-hours
 */
export const getWorkingHoursReport = async (req, res) => {
  try {
    const { startDate, endDate, storeId } = req.query;
    
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const filterStoreId = storeId || null;

    const data = await reportService.getWorkingHoursReport(start, end, filterStoreId);
    
    res.json({
      success: true,
      data: data,
      filters: { startDate: start, endDate: end, storeId: filterStoreId }
    });
  } catch (error) {
    console.error('Error fetching working hours report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch working hours report',
      error: error.message
    });
  }
};

/**
 * Get truck usage analysis report
 * @route GET /api/reports/truck-usage
 */
export const getTruckUsageReport = async (req, res) => {
  try {
    const { year, month, storeId } = req.query;
    const reportYear = year || new Date().getFullYear();
    const reportMonth = month || null;
    const filterStoreId = storeId || null;

    const data = await reportService.getTruckUsageReport(reportYear, reportMonth, filterStoreId);
    
    res.json({
      success: true,
      data: data,
      filters: { year: reportYear, month: reportMonth, storeId: filterStoreId }
    });
  } catch (error) {
    console.error('Error fetching truck usage report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch truck usage report',
      error: error.message
    });
  }
};

/**
 * Get customer order history report
 * @route GET /api/reports/customer-order-history
 */
export const getCustomerOrderHistory = async (req, res) => {
  try {
    const { customerId, startDate, endDate, storeId } = req.query;
    
    const filterCustomerId = customerId || null;
    const filterStartDate = startDate || null;
    const filterEndDate = endDate || null;
    const filterStoreId = storeId || null;

    const data = await reportService.getCustomerOrderHistory(
      filterCustomerId,
      filterStartDate,
      filterEndDate,
      filterStoreId
    );
    
    res.json({
      success: true,
      data: data,
      filters: {
        customerId: filterCustomerId,
        startDate: filterStartDate,
        endDate: filterEndDate,
        storeId: filterStoreId
      }
    });
  } catch (error) {
    console.error('Error fetching customer order history report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer order history report',
      error: error.message
    });
  }
};
