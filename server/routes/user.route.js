import { Router } from 'express';
import { registerUser, loginUser, getloggedInUser, logoutUser, refreshAccessToken } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', authMiddleware, getloggedInUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.put('/refresh-access-token', refreshAccessToken);

export default router;