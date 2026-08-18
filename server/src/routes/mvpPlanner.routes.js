import express from 'express';
import * as mvpPlannerController from '../controllers/mvpPlanner.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', mvpPlannerController.getMVPPlan);
router.post('/generate', aiGenerateLimiter, mvpPlannerController.generateMVPPlan);
router.post('/regenerate', aiGenerateLimiter, mvpPlannerController.generateMVPPlan);
router.post('/ask', mvpPlannerController.askMVPQuestion);
router.delete('/', mvpPlannerController.deleteMVPPlan);

export default router;
