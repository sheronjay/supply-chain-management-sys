import { Router } from 'express'
import { login, signup, verifyToken } from '../controllers/auth.controller.js'
import { authenticateToken } from '../../middleware/auth.js'

const router = Router()

// Signup route
router.post('/signup', signup)

// Login route
router.post('/login', login)

// Verify token route (protected)
router.get('/verify', authenticateToken, verifyToken)

export default router
