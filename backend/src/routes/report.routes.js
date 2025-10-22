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

/**
 * GET /api/reports/quarterly-sales-value
 * Get quarterly sales report by value (revenue)
 */
router.get(
  '/quarterly-sales-value',
  authenticateUser,
  [
    query('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('year must be a valid year'),
    query('storeId')
      .optional()
      .isString()
      .withMessage('storeId must be a string'),
  ],
  validateRequest,
  reportController.getQuarterlySalesValue
);

/**
 * GET /api/reports/quarterly-sales-volume
 * Get quarterly sales report by volume (quantity)
 */
router.get(
  '/quarterly-sales-volume',
  authenticateUser,
  [
    query('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('year must be a valid year'),
    query('storeId')
      .optional()
      .isString()
      .withMessage('storeId must be a string'),
  ],
  validateRequest,
  reportController.getQuarterlySalesVolume
);

/**
 * GET /api/reports/most-ordered-items
 * Get most ordered items in a quarter
 */
router.get(
  '/most-ordered-items',
  authenticateUser,
  [
    query('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('year must be a valid year'),
    query('quarter')
      .optional()
      .isInt({ min: 1, max: 4 })
      .withMessage('quarter must be between 1 and 4'),
    query('storeId')
      .optional()
      .isString()
      .withMessage('storeId must be a string'),
  ],
  validateRequest,
  reportController.getMostOrderedItems
);

/**
 * GET /api/reports/working-hours
 * Get driver and assistant working hours report
 */
router.get(
  '/working-hours',
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
  ],
  validateRequest,
  reportController.getWorkingHoursReport
);

/**
 * GET /api/reports/truck-usage
 * Get truck usage analysis report
 */
router.get(
  '/truck-usage',
  authenticateUser,
  [
    query('year')
      .optional()
      .isInt({ min: 2000, max: 2100 })
      .withMessage('year must be a valid year'),
    query('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('month must be between 1 and 12'),
    query('storeId')
      .optional()
      .isString()
      .withMessage('storeId must be a string'),
  ],
  validateRequest,
  reportController.getTruckUsageReport
);

/**
 * GET /api/reports/customer-order-history
 * Get customer order history report
 */
router.get(
  '/customer-order-history',
  authenticateUser,
  [
    query('customerId')
      .optional()
      .isString()
      .withMessage('customerId must be a string'),
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
  ],
  validateRequest,
  reportController.getCustomerOrderHistory
);

export default router;
