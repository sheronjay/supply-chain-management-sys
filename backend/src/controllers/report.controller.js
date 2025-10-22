import * as reportService from '../../services/report.service.js';
import PDFDocument from 'pdfkit';

// Centralized error handler
const handleError = (res, error, message = 'Internal Server Error') => {
  console.error(message, error);
  return res.status(500).json({ success: false, message, error: error.message });
};

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

    return res.json({
      success: true,
      data: { orders: reports, summary, filters: { startDate: start, endDate: end, storeId: filterStoreId } },
    });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch reports');
  }
};

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
    return res.json({ success: true, data: summary });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch report summary');
  }
};

export const getQuarterlySales = async (req, res) => {
  try {
    const data = await reportService.getQuarterlySales();
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to generate quarterly sales report');
  }
};

export const getTopOrderedItems = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    if (!quarter || !year) return res.status(400).json({ success: false, message: 'quarter and year are required' });
    const data = await reportService.getTopOrderedItems(quarter, year);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch top ordered items');
  }
};

export const getCityRouteSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    const data = await reportService.getCityRouteSales(startDate, endDate);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch city/route sales');
  }
};

export const getDriverWorkingHours = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    const data = await reportService.getDriverWorkingHours(startDate, endDate);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch driver working hours');
  }
};

export const getTruckUsageAnalysis = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ success: false, message: 'month and year are required' });
    const data = await reportService.getTruckUsageAnalysis(month, year);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch truck usage analysis');
  }
};

export const getCustomerOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { startDate, endDate } = req.query;
    if (!customerId) return res.status(400).json({ success: false, message: 'customerId is required' });
    if (!startDate || !endDate) return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    const data = await reportService.getCustomerOrderHistory(customerId, startDate, endDate);
    return res.json({ success: true, data });
  } catch (error) {
    return handleError(res, error, 'Failed to fetch customer order history');
  }
};

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
    res.setHeader('Content-Disposition', 'attachment; filename="orders-report.pdf"');
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
    return handleError(res, error, 'Failed to generate PDF report');
  }
};
export default {
  getReports,
  getReportSummary,
  getQuarterlySales,
  getTopOrderedItems,
  getCityRouteSales,
  getDriverWorkingHours,
  getTruckUsageAnalysis,
  getCustomerOrderHistory,
  exportPDFReport,
};

