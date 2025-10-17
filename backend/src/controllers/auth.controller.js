import * as authService from '../../services/auth.service.js';

/**
 * Customer Login
 */
async function customerLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.customerLogin(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Customer Signup
 */
async function customerSignup(req, res, next) {
  try {
    const { email, password, name, phone_number, city } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, password, and name are required' 
      });
    }

    const result = await authService.customerSignup(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Customer with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
}

/**
 * Employee Login
 */
async function employeeLogin(req, res, next) {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ 
        error: 'User ID and password are required' 
      });
    }

    const result = await authService.employeeLogin(userId, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export {
  customerLogin,
  customerSignup,
  employeeLogin
};
