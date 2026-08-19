import rateLimit from 'express-rate-limit';

export const aiGenerateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Increased limit for development
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many generation requests, please try again later.'
  },
  keyGenerator: (req) => req.user.id // Rate limit by user ID
});
