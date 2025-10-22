import express from 'express';
import { query } from 'express-validator';
import * as reportController from '../controllers/report.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = express.Router();

/**
 * GET /api/reports
 * Get orders report with optional filters (date range, store, status)
 */
router.get(
  '/',
  authenticateUser,
  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('startDate must be a valid ISO date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('endDate must be a valid ISO date'),
    query('storeId')
      .optional()
      .isString()
      .withMessage('storeId must be a string'),
    query('status')
      .optional()
      .isString()
      .withMessage('status must be a string'),
  ],
  validateRequest,
  reportController.getReports
);

/**
 * GET /api/reports/summary
 * Get summary report (optional date filters)
 */
router.get(
  '/summary',
  authenticateUser,
  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('startDate must be a valid ISO date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('endDate must be a valid ISO date'),
  ],
  validateRequest,
  reportController.getReportSummary
);

export default router;
