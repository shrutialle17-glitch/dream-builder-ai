import rateLimit from 'express-rate-limit';

export const aiGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many generation requests. Please wait a moment and try again.'
  },
  keyGenerator: (req) => req.user?.id || req.ip
});
