import express from 'express';
import * as businessPlanController from '../controllers/businessPlan.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', businessPlanController.getBusinessPlan);
router.post('/generate', aiGenerateLimiter, businessPlanController.generateBusinessPlan);
router.post('/regenerate', aiGenerateLimiter, businessPlanController.generateBusinessPlan);
router.post('/ask', businessPlanController.askBusinessPlanQuestion);
router.delete('/', businessPlanController.deleteBusinessPlan);

export default router;
