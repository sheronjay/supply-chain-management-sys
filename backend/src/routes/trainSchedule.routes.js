import express from 'express';
import * as trainScheduleController from '../controllers/trainSchedule.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateUser, trainScheduleController.getTrainSchedules);
router.post('/', authenticateUser, trainScheduleController.createTrainSchedule);
router.get('/trains', authenticateUser, trainScheduleController.getTrains);
router.get('/stores', authenticateUser, trainScheduleController.getStores);

export default router;