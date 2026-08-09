import * as projectService from '../services/project.service.js';

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
