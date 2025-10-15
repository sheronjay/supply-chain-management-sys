import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// List all orders (admin)
router.get('/', orderController.listOrders);

// Place specific routes BEFORE the dynamic ':id' route to avoid shadowing

// Get orders for a specific user/customer
router.get('/user/:userId', orderController.getOrdersByUser);

// Get order statistics
router.get('/stats/summary', orderController.getOrderStats);

// Get products
router.get('/products/list', orderController.getProducts);

// Create order
router.post('/', orderController.createOrder);

// Get single order (keep last)
router.get('/:id', orderController.getOrder);

export default router;