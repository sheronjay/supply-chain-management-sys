const express = require('express');
const { getReportOverview, generatePDFReport } = require('../controllers/controlReport');

const router = express.Router();

router.get('/overview', getReportOverview);
router.get('/export-pdf', generatePDFReport);

module.exports = router;
