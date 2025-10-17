import express from 'express';
import { getReportOverview, generatePDFReport } from '../controllers/controlReport.js';

const router = express.Router();

router.get('/overview', getReportOverview);
router.get('/export-pdf', generatePDFReport);

export default router;
