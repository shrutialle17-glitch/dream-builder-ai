import express from 'express';
import * as pitchDeckController from '../controllers/pitchDeck.controller.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', pitchDeckController.getPitchDeck);
router.post('/generate', aiGenerateLimiter, pitchDeckController.generatePitchDeck);
router.post('/regenerate', aiGenerateLimiter, pitchDeckController.generatePitchDeck);
router.post('/ask', pitchDeckController.askPitchDeckQuestion);
router.delete('/', pitchDeckController.deletePitchDeck);

export default router;
