import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticateUser,optionalAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

// List all orders (with optional authentication for filtering by store)
router.get('/', optionalAuth, orderController.listOrders);

// Place specific routes BEFORE the dynamic ':id' route to avoid shadowing

// Get orders for a specific user/customer
router.get('/user/:userId', authenticateUser,orderController.getOrdersByUser);

// Get order statistics
router.get('/stats/summary', authenticateUser,orderController.getOrderStats);

// Get products
router.get('/products/list',authenticateUser, orderController.getProducts);

// Create order
router.post('/', authenticateUser,orderController.createOrder);

// Get single order (keep last)
router.get('/:id', authenticateUser,orderController.getOrder);

export default router;