import express from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js'; // JWT auth

const router = express.Router();

// Get orders report with filters
router.get('/', authenticateUser, reportController.getReports);

// Get report summary
router.get('/summary',  authenticateUser,reportController.getReportSummary);

export default router;
