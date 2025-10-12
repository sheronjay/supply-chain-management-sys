const { Router } = require('express')
const { getMonthlyRevenue } = require('../controllers/dashboardController')

const router = Router()

router.get('/revenue', getMonthlyRevenue)

module.exports = router