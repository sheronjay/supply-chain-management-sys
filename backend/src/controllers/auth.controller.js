import pool from '../db/pool.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

/**
 * Signup controller for customers
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone_number, city } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      })
    }

    // Check if email already exists
    const [existingCustomers] = await pool.query(
      'SELECT customer_id FROM customers WHERE email = ?',
      [email]
    )

    if (existingCustomers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate customer ID
    const customer_id = uuidv4()

    // Insert new customer
    await pool.query(
      'INSERT INTO customers (customer_id, name, email, password, phone_number, city) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_id, name, email, hashedPassword, phone_number, city]
    )

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: customer_id,
        username: name,
        role: 'customer',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        user_id: customer_id,
        username: name,
        email,
        role: 'customer',
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup',
    })
  }
}

/**
 * Login controller
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      })
    }

    // First check if user is an admin
    const [adminRows] = await pool.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    )

    if (adminRows.length > 0) {
      const admin = adminRows[0]
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, admin.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        })
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: admin.admin_id,
          username: admin.username,
          role: 'admin',
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      return res.json({
        success: true,
        token,
        user: {
          user_id: admin.admin_id,
          username: admin.username,
          email: admin.email,
          role: 'admin',
        },
      })
    }

    // Check if user is a regular user (store managers, delivery employees, etc.)
    const [userRows] = await pool.query(
      'SELECT u.*, sm.manager_id, de.user_id as delivery_id FROM users u LEFT JOIN store_managers sm ON u.user_id = sm.manager_id LEFT JOIN delivery_employees de ON u.user_id = de.user_id WHERE u.name = ? AND u.is_employed = 1',
      [username]
    )

    if (userRows.length > 0) {
      const user = userRows[0]

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        })
      }

      // Determine user role
      let role = 'user'
      if (user.manager_id) {
        role = 'store_manager'
      } else if (user.delivery_id) {
        role = 'delivery_employee'
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.name,
          role,
          store_id: user.store_id,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      return res.json({
        success: true,
        token,
        user: {
          user_id: user.user_id,
          username: user.name,
          designation: user.designation,
          role,
          store_id: user.store_id,
        },
      })
    }

    // Check if user is a customer
    const [customerRows] = await pool.query(
      'SELECT * FROM customers WHERE email = ? OR name = ?',
      [username, username]
    )

    if (customerRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    const customer = customerRows[0]

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, customer.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

    // Generate JWT token for customer
    const token = jwt.sign(
      {
        user_id: customer.customer_id,
        username: customer.name,
        role: 'customer',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      success: true,
      token,
      user: {
        user_id: customer.customer_id,
        username: customer.name,
        email: customer.email,
        role: 'customer',
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    })
  }
}

/**
 * Verify token controller
 */
export const verifyToken = async (req, res) => {
  try {
    // Token is already verified by middleware
    // Just return user info from the token
    res.json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred during token verification',
    })
  }
}
