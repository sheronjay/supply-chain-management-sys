import { Router } from 'express';
import { authenticateUser, authorizeStoreManager } from '../../middleware/auth.middleware.js';
import { 
  getMonthlyRevenue,
  getNewOrdersCount,
  getCompletedDeliveries,
  getOrderHistory,
  getLateDeliveries,
  getSystemAlerts
} from '../controllers/dashboardController.js';

const router = Router();

// Protect all dashboard routes – user must be logged in
router.get('/revenue', authenticateUser, getMonthlyRevenue);
router.get('/new-orders-count', authenticateUser, getNewOrdersCount);
router.get('/completed-deliveries', authenticateUser, getCompletedDeliveries);
router.get('/order-history', authenticateUser, getOrderHistory);
router.get('/late-deliveries', authenticateUser, getLateDeliveries);
router.get('/alerts', authenticateUser, getSystemAlerts);

export default router;
