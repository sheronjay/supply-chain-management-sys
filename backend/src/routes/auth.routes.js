// src/routes/auth.routes.js
import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Customer routes
router.post('/customer/login', authController.customerLogin); // returns { token, user }
router.post('/customer/signup', authController.customerSignup); // returns { token, user }

// Employee routes
router.post('/employee/login', authController.employeeLogin); // returns { token, user }

export default router;
