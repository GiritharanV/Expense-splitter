import pool from '../config/db.js';
import { Router } from 'express';
import { getUsers,addUser,updateUser,deleteUser } from '../controllers/UsersController.js';

const router = Router();

router.get('/', getUsers);
router.post('/', addUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;