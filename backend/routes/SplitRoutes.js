import { Router } from 'express';
import { updateSplit, deleteSplit } from '../controllers/splitController.js';

const router = Router();

router.put('/:split_id', updateSplit);
router.delete('/:split_id', deleteSplit);

export default router;
