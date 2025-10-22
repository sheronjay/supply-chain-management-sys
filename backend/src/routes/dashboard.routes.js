import { Router } from 'express';
import { query } from 'express-validator';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import {
  getMonthlyRevenue,
  getNewOrdersCount,
  getCompletedDeliveries,
  getOrderHistory,
  getLateDeliveries,
  getSystemAlerts,
} from '../controllers/dashboardController.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = Router();

//  Validate month query (optional but must be string/valid format if provided)
const validateMonthQuery = [
  query('month')
    .optional()
    .isString()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/) // format: YYYY-MM
    .withMessage('Month must be in YYYY-MM format'),
  validateRequest,
];

// Secure routes with authentication + validation

router.get('/revenue', authenticateUser, validateMonthQuery, getMonthlyRevenue);
router.get('/new-orders-count', authenticateUser, validateMonthQuery, getNewOrdersCount);
router.get('/completed-deliveries', authenticateUser, validateMonthQuery, getCompletedDeliveries);
router.get('/order-history', authenticateUser, getOrderHistory);
router.get('/late-deliveries', authenticateUser, validateMonthQuery, getLateDeliveries);
router.get('/alerts', authenticateUser, getSystemAlerts);

export default router;
