import { getDigitalTwin, simulateScenario, generateInsights, askQuestion } from '../services/digitalTwin.service.js';
import * as projectService from '../services/project.service.js';

export const getProjectDigitalTwin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    await projectService.getProjectById(projectId, req.user.id); // Verify ownership
    const twin = await getDigitalTwin(projectId);
    res.json(twin);
  } catch (error) {
    next(error);
  }
};

export const runProjectSimulation = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { customAssumptions } = req.body;
    
    await projectService.getProjectById(projectId, req.user.id); // Verify ownership
    const twin = await simulateScenario(projectId, customAssumptions);
    res.json(twin);
  } catch (error) {
    next(error);
  }
};

export const getProjectInsights = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { scenarioKey } = req.body; // 'base', 'optimistic', 'conservative', 'custom'
    
    await projectService.getProjectById(projectId, req.user.id); // Verify ownership
    const twin = await generateInsights(projectId, scenarioKey || 'base');
    res.json(twin);
  } catch (error) {
    next(error);
  }
};

export const askDigitalTwinQuestion = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    await projectService.getProjectById(projectId, req.user.id); // Verify ownership
    const answer = await askQuestion(projectId, question, req.user.id);
    res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    next(error);
  }
};
