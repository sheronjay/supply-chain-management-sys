const { Router } = require('express')
const { getMonthlyRevenue } = require('../controllers/dashboardController')
const { getNewOrdersCount } = require('../controllers/dashboardController')
const { getCompletedDeliveries } = require('../controllers/dashboardController')
const { getOrderHistory } = require('../controllers/dashboardController')
const { getLateDeliveries } = require('../controllers/dashboardController')
const { getSystemAlerts } = require('../controllers/dashboardController')

const router = Router()

router.get('/revenue', getMonthlyRevenue)
router.get('/new-orders-count', getNewOrdersCount)
router.get('/completed-deliveries', getCompletedDeliveries)
router.get('/order-history',getOrderHistory)
router.get('/late-deliveries', getLateDeliveries)
router.get('/alerts', getSystemAlerts)

module.exports = router