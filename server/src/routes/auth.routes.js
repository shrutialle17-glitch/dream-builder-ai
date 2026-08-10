import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe, googleAuth  } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 auth requests per minute
  message: { success: false, message: 'Too many requests, please try again later.' }
});

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.post('/google', googleAuth);

export default router;
