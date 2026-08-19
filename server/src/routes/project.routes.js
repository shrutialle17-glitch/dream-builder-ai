import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

import { validateRequest } from '../middleware/validateRequest.js';
import {
  createProjectSchema,
  updateProjectSchema
} from '../validations/project.validations.js';

import { requireAuth } from '../middleware/auth.middelware.js';
import digitalTwinRoutes from './digitalTwin.routes.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validateRequest(createProjectSchema), createProject);
router.put('/:id', validateRequest(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

// Digital Twin routes
router.use('/:projectId/digital-twin', digitalTwinRoutes);

export default router;