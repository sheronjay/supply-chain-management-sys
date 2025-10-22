import express from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

/** =======================
 *  MAIN REPORT ROUTES
 *  ======================= */

// Get orders report with filters
router.get('/', reportController.getReports);

// Get report summary
router.get('/summary', reportController.getReportSummary);

// Export all reports as PDF
router.get('/export/pdf', reportController.exportPDFReport);

/** =======================
 *  SPECIALIZED REPORTS
 *  ======================= */

// 1. Quarterly Sales Report (value + volume)
router.get('/quarterly-sales', reportController.getQuarterlySales);

// 2. Most Ordered Items in a Given Quarter
router.get('/top-ordered-items', reportController.getTopOrderedItems);

// 3. City-wise & Route-wise Sales Breakdown
router.get('/city-route-sales', reportController.getCityRouteSales);

// 4. Driver Working Hours Report
router.get('/driver-hours', reportController.getDriverWorkingHours);

// 5. Truck Usage Analysis per Month
router.get('/truck-usage', reportController.getTruckUsageAnalysis);

// 6. Customer Order History with Delivery Details
router.get('/customer-history/:customerId', reportController.getCustomerOrderHistory);

export default router;
