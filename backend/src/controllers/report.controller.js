import * as reportService from '../../services/report.service.js';
import PDFDocument from 'pdfkit';

/**
 * Get orders report with filters
 * @route GET /api/reports
 */
export const getReports = async (req, res) => {
  try {
    const { startDate, endDate, storeId } = req.query;

    const end = endDate || new Date().toISOString().split('T')[0];
    const start =
      startDate ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const filterStoreId = storeId || null;

    const reports = await reportService.getOrdersReport(start, end, filterStoreId);
    const summary = await reportService.getReportSummary(start, end, filterStoreId);

    res.json({
      success: true,
      data: {
        orders: reports,
        summary,
        filters: { startDate: start, endDate: end, storeId: filterStoreId },
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message,
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
    const start =
      startDate ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

    const filterStoreId = storeId || null;

    const summary = await reportService.getReportSummary(start, end, filterStoreId);
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching report summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report summary',
      error: error.message,
    });
  }
};

/**
 * Generate Quarterly Sales Report (Value and Volume)
 */
export const getQuarterlySalesReport = async (req, res) => {
  try {
    const data = await reportService.getQuarterlySales();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error generating quarterly sales report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate quarterly sales report',
      error: error.message,
    });
  }
};

/**
 * Most Ordered Items in a Given Quarter
 */
/**
 * Get most ordered items in a quarter
 * @route GET /api/reports/top-ordered-items
 */
export const getTopOrderedItems = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const data = await reportService.getTopOrderedItems(quarter, year);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching top ordered items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top ordered items',
      error: error.message,
    });
  }
};

/**
 * Get city-wise and route-wise sales breakdown
 * @route GET /api/reports/city-route-sales
 */
export const getCityRouteSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await reportService.getCityRouteSales(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching city-route sales:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city-route sales',
      error: error.message,
    });
  }
};

/**
 * Get driver working hours report
 * @route GET /api/reports/driver-hours
 */
export const getDriverWorkingHours = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await reportService.getDriverWorkingHours(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching driver working hours:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver working hours',
      error: error.message,
    });
  }
};

/**
 * Get truck usage analysis
 * @route GET /api/reports/truck-usage
 */
export const getTruckUsageAnalysis = async (req, res) => {
  try {
    const { month, year } = req.query;
    const data = await reportService.getTruckUsageAnalysis(month, year);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching truck usage analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch truck usage analysis',
      error: error.message,
    });
  }
};

/**
 * Get customer order history with delivery details
 * @route GET /api/reports/customer-history/:customerId
 */
export const getCustomerOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { startDate, endDate } = req.query;
    const data = await reportService.getCustomerOrderHistory(customerId, startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching customer order history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer order history',
      error: error.message,
    });
  }
};

/**
 * City-wise and Route-wise Sales Breakdown
 */
export const getCityRouteSales = async (req, res) => {
  try {
    const data = await reportService.getCityRouteSales();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching city/route sales breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city/route sales breakdown',
      error: error.message,
    });
  }
};

/**
 * Driver and Assistant Working Hours Report
 */
export const getDriverAssistantHours = async (req, res) => {
  try {
    const data = await reportService.getDriverAssistantHours();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching driver/assistant hours:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver/assistant hours',
      error: error.message,
    });
  }
};

/**
 * Truck Usage Analysis per Month
 */
export const getTruckUsageReport = async (req, res) => {
  try {
    const data = await reportService.getTruckUsagePerMonth();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching truck usage report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch truck usage report',
      error: error.message,
    });
  }
};

/**
 * Customer Order History with Delivery Details
 */
export const getCustomerOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.query;
    const data = await reportService.getCustomerOrderHistory(customerId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching customer order history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer order history',
      error: error.message,
    });
  }
};

/**
 * Export PDF Report
 */
export const exportPDFReport = async (req, res) => {
  try {
    const { startDate, endDate, storeId } = req.query;

    const end = endDate || new Date().toISOString().split('T')[0];
    const start =
      startDate ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    const filterStoreId = storeId || null;

    const reports = await reportService.getOrdersReport(start, end, filterStoreId);
    const summary = await reportService.getReportSummary(start, end, filterStoreId);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="orders-report.pdf"'
    );
    doc.pipe(res);

    doc.fontSize(18).text('Orders Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date Range: ${start} to ${end}`);
    if (filterStoreId) doc.text(`Store ID: ${filterStoreId}`);
    doc.moveDown();

    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12).text(JSON.stringify(summary, null, 2));
    doc.moveDown();

    doc.fontSize(14).text('Orders', { underline: true });
    doc.moveDown(0.5);

    reports.forEach((order) => {
      doc.fontSize(12).text(`Order ID: ${order.order_id}`);
      doc.text(`Customer: ${order.customer_name}`);
      doc.text(`Email: ${order.customer_email}`);
      doc.text(`Store: ${order.store}`);
      doc.text(`Total Price: ${order.total_price}`);
      doc.text(`Status: ${order.status}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF report',
      error: error.message,
    });
  }
};
