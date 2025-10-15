import pool from '../db/pool.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

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

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      })
    }

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

    res.json({
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
