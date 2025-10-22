import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/driver/orders/:driverId
 * @desc    Get all orders assigned to a driver
 */
router.get('/orders/:driverId', authenticateUser, driverController.getDriverOrders);
/**
 * @route   GET /api/driver/details/:driverId
 * @desc    Get driver's details including working hours
 */
router.get('/details/:driverId', authenticateUser, driverController.getDriverDetails);
/**
 * @route   PUT /api/driver/deliver/:orderId
 * @desc    Mark an order as delivered
 */
router.put('/deliver/:orderId', authenticateUser, driverController.markOrderAsDelivered);

/**
 * @route   PUT /api/driver/working-hours/:driverId
 * @desc    Update driver's working hours
 */
router.put('/working-hours/:driverId', authenticateUser, driverController.updateWorkingHours);
export default router;
