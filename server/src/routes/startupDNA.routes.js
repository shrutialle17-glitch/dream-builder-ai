import express from 'express';
import * as startupDNAController from '../controllers/startupDNA.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', startupDNAController.getStartupDNA);
router.post('/generate', aiGenerateLimiter, startupDNAController.generateStartupDNA);
router.post('/regenerate', aiGenerateLimiter, startupDNAController.regenerateStartupDNA);
router.post('/ask', startupDNAController.askDNAQuestion);

export default router;
