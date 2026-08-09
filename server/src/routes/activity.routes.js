import express from 'express';
import { getActivities } from '../controllers/activity.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth); // All activity routes require authentication

router.get('/', getActivities);

export default router;
