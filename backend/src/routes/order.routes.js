import express from 'express';
import { body, param } from 'express-validator';
import * as orderController from '../controllers/order.controller.js';
import { authenticateUser, optionalAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = express.Router();

// List all orders (with optional authentication for filtering by store)
router.get('/', optionalAuth, orderController.listOrders);

// Place specific routes BEFORE the dynamic ':id' route to avoid shadowing

// Get orders for a specific user/customer
router.get(
  '/user/:userId',
  authenticateUser,
  [
    param('userId').isString().notEmpty().withMessage('User ID is required and must be a string'),
  ],
  validateRequest,
  orderController.getOrdersByUser
);

// Get order statistics
router.get('/stats/summary', authenticateUser, orderController.getOrderStats);

// Get products
router.get('/products/list', authenticateUser, orderController.getProducts);

// Create order
router.post(
  '/',
  authenticateUser,
  [
    body('customerId').isString().notEmpty().withMessage('Customer ID is required'),
    body('products').isArray({ min: 1 }).withMessage('Products array is required'),
    body('totalPrice').isFloat({ gt: 0 }).withMessage('Total price must be a positive number'),
  ],
  validateRequest,
  orderController.createOrder
);

// Get single order (keep last)
router.get(
  '/:id',
  authenticateUser,
  [
    param('id').isString().notEmpty().withMessage('Order ID is required'),
  ],
  validateRequest,
  orderController.getOrder
);

export default router;
