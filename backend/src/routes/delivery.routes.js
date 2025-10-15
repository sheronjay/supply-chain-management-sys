import express from 'express'
import { getMyDeliveries, getUpcomingDeliveries, updateDeliveryStatus } from '../controllers/delivery.controller.js'
import { authenticateToken } from '../../middleware/auth.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all deliveries for current user
router.get('/my-deliveries', getMyDeliveries)

// Get upcoming deliveries for current user
router.get('/upcoming', getUpcomingDeliveries)

// Update delivery status
router.patch('/:delivery_id/status', updateDeliveryStatus)

export default router
