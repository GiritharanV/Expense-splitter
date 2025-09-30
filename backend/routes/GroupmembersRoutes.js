import { Router } from 'express';
import { addGroupmember, removeGroupmember, getGroupmembers } from '../controllers/GroupmembersController.js';

const router = Router();
router.post('/', addGroupmember);
router.delete('/:id', removeGroupmember);
router.get('/:group_id', getGroupmembers);

export default router;
