import express from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

// Get orders report with filters
router.get('/', reportController.getReports);

// Get report summary
router.get('/summary', reportController.getReportSummary);

router.get('/export/pdf', reportController.exportPDFReport);

export default router;
