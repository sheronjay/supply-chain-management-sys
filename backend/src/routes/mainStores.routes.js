import express from 'express';
import { body, param } from 'express-validator';
import * as mainStoresController from '../controllers/mainStores.controller.js';
import { authenticateUser, authorizeStoreManager } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js'; 
import { authorizeMainStoreManager } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/main-stores/pending-orders
 * @desc    Get all pending orders (any logged-in user)
 */
router.get(
  '/pending-orders',
  authenticateUser,
  mainStoresController.getPendingOrders
);

/**
 * @route   GET /api/main-stores/train-schedules
 * @desc    Get all train schedules (any logged-in user)
 */
router.get(
  '/train-schedules',
  authenticateUser,
  mainStoresController.getTrainSchedules
);

/**
 * @route   POST /api/main-stores/process-order
 * @desc    Process an order (only store managers)
 */
router.post(
  '/process-order',
  authenticateUser,
  authorizeStoreManager,
  [
    body('orderId')
      .isString()
      .notEmpty()
      .withMessage('Order ID is required and must be a valid string'),
    body('tripId')
      .isString()
      .notEmpty()
      .withMessage('Trip ID is required and must be a valid string'),
  ],
  validateRequest,
  mainStoresController.processOrder
);
// Process an order (only main store managers)
router.post('/process-order', authenticateUser, authorizeMainStoreManager, mainStoresController.processOrder);

/**
 * @route   GET /api/main-stores/train-schedules/:tripId/orders
 * @desc    Get orders for a specific train schedule
 */
router.get(
  '/train-schedules/:tripId/orders',
  authenticateUser,
  [
    param('tripId')
      .isString()
      .notEmpty()
      .withMessage('Trip ID parameter is required'),
  ],
  validateRequest,
  mainStoresController.getScheduleOrders
);
// Get orders for a specific train schedule (any logged-in user)
router.get('/train-schedules/:tripId/orders', authenticateUser, mainStoresController.getScheduleOrders);

// Product management routes
router.get('/products', mainStoresController.getAllProducts);
router.post('/products', mainStoresController.addProduct);
router.put('/products', mainStoresController.updateProduct);
router.delete('/products', mainStoresController.deleteProduct);
router.put('/products/stock', mainStoresController.updateProductStock);

export default router;
