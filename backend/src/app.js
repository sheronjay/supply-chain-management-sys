const express = require('express')
const cors = require('cors')

const dashboardRoutes = require('./routes/dashboard.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/dashboard', dashboardRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

module.exports = app