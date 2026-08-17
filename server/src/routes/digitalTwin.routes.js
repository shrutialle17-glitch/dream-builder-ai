import express from 'express';
import * as digitalTwinController from '../controllers/digitalTwin.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', digitalTwinController.getProjectDigitalTwin);
router.post('/simulate', digitalTwinController.runProjectSimulation);
router.post('/insights', aiGenerateLimiter, digitalTwinController.getProjectInsights);
router.post('/ask', digitalTwinController.askDigitalTwinQuestion);

export default router;
