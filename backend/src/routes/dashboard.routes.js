import { Router } from 'express';
import { 
  getMonthlyRevenue,
  getNewOrdersCount,
  getCompletedDeliveries,
  getOrderHistory,
  getLateDeliveries,
  getSystemAlerts
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/revenue', getMonthlyRevenue);
router.get('/new-orders-count', getNewOrdersCount);
router.get('/completed-deliveries', getCompletedDeliveries);
router.get('/order-history', getOrderHistory);
router.get('/late-deliveries', getLateDeliveries);
router.get('/alerts', getSystemAlerts);

export default router;