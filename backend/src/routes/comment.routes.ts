import { Router } from 'express';
import { updateComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
