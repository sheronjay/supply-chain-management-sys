import express from 'express';
import { body, param } from 'express-validator';
import * as storeManagerController from '../controllers/storeManager.controller.js';
import { authenticateUser, authorizeStoreManager } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = express.Router();

// Get all orders with status 'TRAIN' for a store
router.get(
  '/orders/:storeId?',
  authenticateUser,
  authorizeStoreManager,
  [
    param('storeId').optional().isString().withMessage('storeId must be a string'),
  ],
  validateRequest,
  storeManagerController.getStoreOrders
);

// Get all orders with status 'IN-STORE' for a store (inventory)
router.get(
  '/inventory/:storeId?',
  authenticateUser,
  authorizeStoreManager,
  [
    param('storeId').optional().isString().withMessage('storeId must be a string'),
  ],
  validateRequest,
  storeManagerController.getStoreInventory
);

// Accept an order (update status from 'TRAIN' to 'IN-STORE')
router.patch(
  '/orders/:orderId/accept',
  authenticateUser,
  authorizeStoreManager,
  [
    param('orderId').isString().withMessage('orderId is required and must be a string'),
    body('managerId').isString().withMessage('managerId is required and must be a string'),
  ],
  validateRequest,
  storeManagerController.acceptOrder
);

// Get trucks for a store
router.get(
  '/trucks/:storeId',
  authenticateUser,
  authorizeStoreManager,
  [param('storeId').isString().withMessage('storeId is required')],
  validateRequest,
  storeManagerController.getTrucks
);

// Get drivers for a store
router.get(
  '/drivers/:storeId',
  authenticateUser,
  authorizeStoreManager,
  [param('storeId').isString().withMessage('storeId is required')],
  validateRequest,
  storeManagerController.getDrivers
);

// Get assistants for a store
router.get(
  '/assistants/:storeId',
  authenticateUser,
  authorizeStoreManager,
  [param('storeId').isString().withMessage('storeId is required')],
  validateRequest,
  storeManagerController.getAssistants
);

// Get delivery employees with working hours
router.get(
  '/delivery-employees/:storeId?',
  authenticateUser,
  authorizeStoreManager,
  [param('storeId').optional().isString().withMessage('storeId must be a string')],
  validateRequest,
  storeManagerController.getDeliveryEmployees
);

// Assign order to truck with driver and assistant
router.post(
  '/orders/:orderId/assign-truck',
  authenticateUser,
  authorizeStoreManager,
  [
    param('orderId').isString().withMessage('orderId is required'),
    body('truckId').isString().withMessage('truckId is required'),
    body('driverId').isString().withMessage('driverId is required'),
    body('assistantId').isString().withMessage('assistantId is required'),
  ],
  validateRequest,
  storeManagerController.assignOrderToTruck
);

export default router;
