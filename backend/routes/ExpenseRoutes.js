import { Router } from 'express';
import { addExpense, getGroupExpenses } from '../controllers/ExpenseController.js';

const router = Router();

router.post('/', addExpense);
router.get('/:group_id', getGroupExpenses);

export default router;
