import express from 'express';
import { body, validationResult } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { validateRequest } from '../../middleware/validation.middleware.js';

const router = express.Router();


//  Customer signup
router.post(
  '/customer/signup',
  [
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name')
      .trim()
      .escape()
      .notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  authController.customerSignup
);

//  Customer login
router.post(
  '/customer/login',
  [
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.customerLogin
);

//  Employee login
router.post(
  '/employee/login',
  [
    body('userId')
      .notEmpty().withMessage('User ID is required')
      .trim()
      .escape(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.employeeLogin
);

export default router;
