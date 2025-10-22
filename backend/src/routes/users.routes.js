import express from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateUser, usersController.listUsers);
router.post('/', authenticateUser, usersController.createUser);
router.put('/:id', authenticateUser, usersController.updateUser);
router.delete('/:id', authenticateUser, usersController.deleteUser);
router.put('/:id/toggle', authenticateUser, usersController.toggleEmployment);

export default router;


