import * as projectService from '../services/project.service.js';
import * as startupOverviewService from '../services/startupOverview.service.js';

export const getProjects = async (req, res, next) => {
  try {
    const result = await projectService.getProjects(req.user.id, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

const generatingOverviews = new Set();

export const getProjectOverview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await projectService.getProjectById(id, req.user.id); // Check ownership

    const overview = await startupOverviewService.getStartupOverview(id);
    if (!overview) {
      return res.status(404).json({
        success: false,
        code: 'OVERVIEW_NOT_FOUND',
        message: 'No overview has been generated for this project yet.'
      });
    }

    res.json({ success: true, data: overview });
  } catch (error) {
    next(error);
  }
};

export const generateProjectOverview = async (req, res, next) => {
  const { id } = req.params;
  try {
    await projectService.getProjectById(id, req.user.id); // Check ownership

    if (generatingOverviews.has(id)) {
      return res.status(409).json({
        success: false,
        code: 'GENERATION_IN_PROGRESS',
        message: 'Startup overview generation is already in progress for this project.'
      });
    }

    generatingOverviews.add(id);

    // If an overview already exists, we return 200 after generation.
    const existingOverview = await startupOverviewService.getStartupOverview(id);
    const statusCode = existingOverview ? 200 : 201;

    const overview = await startupOverviewService.generateStartupOverview(id);
    
    generatingOverviews.delete(id);
    res.status(statusCode).json({ success: true, data: overview });
  } catch (error) {
    generatingOverviews.delete(id);
    if (error.message === 'AI_GENERATION_FAILED') {
      return res.status(502).json({
        success: false,
        code: 'AI_GENERATION_FAILED',
        message: 'The startup overview could not be generated. You can try again.'
      });
    }
    next(error);
  }
};
