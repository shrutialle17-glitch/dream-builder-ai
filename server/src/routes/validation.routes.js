import express from 'express';
import * as validationController from '../controllers/validation.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', validationController.getProjectValidation);
router.post('/generate', aiGenerateLimiter, validationController.generateProjectValidation);
router.post('/regenerate', aiGenerateLimiter, validationController.generateProjectValidation);
router.post('/ask', validationController.askValidationQuestion);

export default router;
