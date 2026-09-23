import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';
import {
  getPostComments,
  createComment,
} from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Post routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

// Comments nested under post routes
router.get('/:id/comments', getPostComments);
router.post('/:id/comments', authenticate, createComment);

export default router;
