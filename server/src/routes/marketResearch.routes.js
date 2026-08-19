import express from 'express';
import * as marketResearchController from '../controllers/marketResearch.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', marketResearchController.getMarketResearch);
router.post('/generate', aiGenerateLimiter, marketResearchController.generateMarketResearch);
router.post('/regenerate', aiGenerateLimiter, marketResearchController.generateMarketResearch);
router.delete('/', marketResearchController.deleteMarketResearch);
router.post('/ask', marketResearchController.askMarketResearchQuestion);

export default router;
