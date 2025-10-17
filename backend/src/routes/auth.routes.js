import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Customer routes
router.post('/customer/login', authController.customerLogin);
router.post('/customer/signup', authController.customerSignup);

// Employee routes
router.post('/employee/login', authController.employeeLogin);

export default router;
