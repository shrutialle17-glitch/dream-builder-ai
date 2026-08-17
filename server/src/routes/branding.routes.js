import express from 'express';
import * as brandingController from '../controllers/branding.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', brandingController.getBranding);
router.post('/generate', aiGenerateLimiter, brandingController.generateBranding);
router.post('/regenerate', aiGenerateLimiter, brandingController.generateBranding);
router.post('/ask', brandingController.askBrandingQuestion);
router.delete('/', brandingController.deleteBranding);

export default router;
