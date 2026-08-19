import BrandingService from '../services/branding.service.js';
import prisma from '../lib/prisma.js';

export const getBranding = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const branding = await BrandingService.getBranding(projectId);
    res.status(200).json({ success: true, data: branding || null });
  } catch (error) {
    next(error);
  }
};

export const generateBranding = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const branding = await BrandingService.generateBranding(projectId);
    res.status(200).json({ success: true, data: branding });
  } catch (error) {
    next(error);
  }
};

export const askBrandingQuestion = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const answer = await BrandingService.askQuestion(projectId, question, req.user.id);
    res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    next(error);
  }
};

export const deleteBranding = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await BrandingService.deleteBranding(projectId);
    res.status(200).json({ success: true, message: 'Branding deleted successfully' });
  } catch (error) {
    next(error);
  }
};
