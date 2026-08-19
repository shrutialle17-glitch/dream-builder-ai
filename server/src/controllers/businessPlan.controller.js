import * as businessPlanService from '../services/businessPlan.service.js';
export const getBusinessPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const plan = await businessPlanService.getBusinessPlan(projectId, userId);
    if (!plan) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const generateBusinessPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const plan = await businessPlanService.generateBusinessPlan(projectId, userId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    await businessPlanService.deleteBusinessPlan(projectId, userId);
    res.status(200).json({ success: true, message: 'Business plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const askBusinessPlanQuestion = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const answer = await businessPlanService.askBusinessPlanQuestion(projectId, userId, question);
    res.status(200).json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};
