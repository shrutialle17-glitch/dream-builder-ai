import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe, googleAuth, updateMe, updatePassword, forgotPassword, resetPassword  } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  // Make the limit configurable via env var for development convenience
  // Defaults to 50 requests per minute if AUTH_RATE_LIMIT_MAX is not set
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 50,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);
router.post('/google', googleAuth);
router.patch('/me', requireAuth, updateMe);
router.patch('/me/password', requireAuth, updatePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
