import express from 'express';
import * as storeManagerController from '../controllers/storeManager.controller.js';

const router = express.Router();

// Get all orders with status 'TRAIN' for a store
router.get('/orders/:storeId?', storeManagerController.getStoreOrders);

// Get all orders with status 'IN-STORE' for a store (inventory)
router.get('/inventory/:storeId?', storeManagerController.getStoreInventory);

// Accept an order (update status from 'TRAIN' to 'IN-STORE')
router.patch('/orders/:orderId/accept', storeManagerController.acceptOrder);

export default router;
