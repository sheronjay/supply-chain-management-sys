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


//  Quarterly Sales Report (value + volume)
router.get('/quarterly-sales', reportController.getQuarterlySalesReport);

//  Most Ordered Items in a Given Quarter
router.get('/top-items', reportController.getTopOrderedItems);

//  City-wise & Route-wise Sales Breakdown
router.get('/city-route-sales', reportController.getCityRouteSales);

//  Driver & Assistant Working Hours
router.get('/driver-hours', reportController.getDriverAssistantHours);

//  Truck Usage Analysis per Month
router.get('/truck-usage', reportController.getTruckUsageReport);

//  Customer Order History with Delivery Details
router.get('/customer-history', reportController.getCustomerOrderHistory);

export default router;
