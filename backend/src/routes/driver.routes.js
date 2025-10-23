import express from 'express';
import { param, body } from 'express-validator';
import * as driverController from '../controllers/driver.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/driver/orders/:driverId
 * @desc    Get all orders assigned to a driver
 */
router.get(
  '/orders/:driverId',
  authenticateUser,
  [param('driverId').isString().notEmpty().withMessage('Driver ID is required')],
  validateRequest,
  driverController.getDriverOrders
);

/**
 * @route   GET /api/driver/details/:driverId
 * @desc    Get driver's details including working hours
 */
router.get(
  '/details/:driverId',
  authenticateUser,
  [param('driverId').isString().notEmpty().withMessage('Driver ID is required')],
  validateRequest,
  driverController.getDriverDetails
);

/**
 * @route   PUT /api/driver/deliver/:orderId
 * @desc    Mark an order as delivered
 */
router.put(
  '/deliver/:orderId',
  authenticateUser,
  [param('orderId').isString().notEmpty().withMessage('Order ID is required')],
  validateRequest,
  driverController.markOrderAsDelivered
);

/**
 * @route   PUT /api/driver/working-hours/:driverId
 * @desc    Update driver's working hours
 */
router.put(
  '/working-hours/:driverId',
  authenticateUser,
  [
    param('driverId').isString().notEmpty().withMessage('Driver ID is required'),
    body('workingHours')
      .isNumeric()
      .withMessage('Working hours must be a number')
      .isFloat({ min: 0, max: 40 })
      .withMessage('Working hours must be between 0 and 40'),
  ],
  validateRequest,
  driverController.updateWorkingHours
);

export default router;
