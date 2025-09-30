import { Router } from 'express';
import { getBalances, settleUp, getSettlements } from '../controllers/TransactionController.js';

const router = Router();

router.get('/balances/:group_id', getBalances);

router.post('/settle/:group_id', settleUp);

// ✅ Get all settlements in a group
router.get('/settlements/:group_id', getSettlements);

export default router;
