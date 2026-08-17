import * as projectService from '../services/project.service.js';
import * as validationService from '../services/validation.service.js';

const generatingValidations = new Set();

export const getProjectValidation = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await projectService.getProjectById(projectId, req.user.id); // Check ownership

    const validation = await validationService.getIdeaValidation(projectId);
    
    if (!validation) {
      return res.status(404).json({
        success: false,
        code: 'VALIDATION_NOT_FOUND',
        message: 'No validation has been generated for this project yet.'
      });
    }

    res.json({ success: true, data: validation });
  } catch (error) {
    next(error);
  }
};

export const generateProjectValidation = async (req, res, next) => {
  const { projectId } = req.params;
  try {
    await projectService.getProjectById(projectId, req.user.id); // Check ownership

    if (generatingValidations.has(projectId)) {
      return res.status(409).json({
        success: false,
        code: 'GENERATION_IN_PROGRESS',
        message: 'Idea validation generation is already in progress for this project.'
      });
    }

    generatingValidations.add(projectId);

    // If a validation already exists, we return 200 after generation.
    const existingValidation = await validationService.getIdeaValidation(projectId);
    const statusCode = existingValidation ? 200 : 201;

    const validation = await validationService.generateIdeaValidation(projectId);
    
    generatingValidations.delete(projectId);
    res.status(statusCode).json({ success: true, data: validation });
  } catch (error) {
    generatingValidations.delete(projectId);
    if (error.message === 'OVERVIEW_REQUIRED') {
      return res.status(409).json({
        success: false,
        code: 'OVERVIEW_REQUIRED',
        message: 'Startup Overview must be completed before generating Idea Validation.'
      });
    }
    if (error.message === 'AI_GENERATION_FAILED') {
      return res.status(502).json({
        success: false,
        code: 'AI_GENERATION_FAILED',
        message: 'The idea validation could not be generated. You can try again.'
      });
    }
    next(error);
  }
};

export const askValidationQuestion = async (req, res, next) => {
  const { projectId } = req.params;
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }

  try {
    await projectService.getProjectById(projectId, req.user.id);
    const answer = await validationService.askValidationQuestion(projectId, question);
    res.json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};
