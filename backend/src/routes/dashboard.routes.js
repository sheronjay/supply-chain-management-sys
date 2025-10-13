const { Router } = require('express')
const { getMonthlyRevenue } = require('../controllers/dashboardController')
const { getNewOrdersCount } = require('../controllers/dashboardController')
const { getCompletedDeliveries } = require('../controllers/dashboardController')

const router = Router()

router.get('/revenue', getMonthlyRevenue)
router.get('/new-orders-count', getNewOrdersCount)
router.get('/completed-deliveries', getCompletedDeliveries)

module.exports = router