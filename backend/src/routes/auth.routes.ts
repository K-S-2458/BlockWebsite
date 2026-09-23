import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
