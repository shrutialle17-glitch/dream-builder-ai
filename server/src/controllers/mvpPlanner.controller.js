import * as mvpPlannerService from '../services/mvpPlanner.service.js';

export const getMVPPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const plan = await mvpPlannerService.getMVPPlan(projectId, userId);
    if (!plan) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const generateMVPPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const plan = await mvpPlannerService.generateMVPPlan(projectId, userId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

export const deleteMVPPlan = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    await mvpPlannerService.deleteMVPPlan(projectId, userId);
    res.status(200).json({ success: true, message: 'MVP plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const askMVPQuestion = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const answer = await mvpPlannerService.askMVPQuestion(projectId, userId, question);
    res.status(200).json({ success: true, answer });
  } catch (error) {
    next(error);
  }
};
