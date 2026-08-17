import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject, getProjectOverview, generateProjectOverview } from '../controllers/project.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createProjectSchema, updateProjectSchema } from '../validations/project.validation.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { aiGenerateLimiter } from '../middleware/rateLimit.middleware.js';

//Import all sub-routers
import businessPlanRoutes from './businessPlan.routes.js';
import chatRoutes from './chat.routes.js';
import brandingRoutes from './branding.routes.js';
/* 
import validationRoutes from './validation.routes.js';
import startupDNARoutes from './startupDNA.routes.js';
import mvpPlannerRoutes from './mvpPlanner.routes.js';
import pitchDeckRoutes from './pitchDeck.routes.js';
import digitalTwinRoutes from './digitalTwin.routes.js';
import marketResearchRoutes from './marketResearch.routes.js';
*/

const router = express.Router();

// Require auth for all project routes
router.use(requireAuth);

// Core Project CRUD
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validateRequest(createProjectSchema), createProject);
router.put('/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Project Overview (attached directly to project)
router.get('/:id/overview', getProjectOverview);
router.post('/:id/overview/generate', aiGenerateLimiter, generateProjectOverview);

//Mount Sub-Modules
router.use('/:projectId/business-plan', businessPlanRoutes);
router.use('/:projectId/chat', chatRoutes);
router.use('/:projectId/branding', brandingRoutes);
/* 
router.use('/:projectId/validation', validationRoutes);
router.use('/:projectId/startup-dna', startupDNARoutes);
router.use('/:projectId/mvp', mvpPlannerRoutes);
router.use('/:projectId/pitch-deck', pitchDeckRoutes);
router.use('/:projectId/digital-twin', digitalTwinRoutes);
router.use('/:projectId/market-research', marketResearchRoutes);
*/

export default router;
