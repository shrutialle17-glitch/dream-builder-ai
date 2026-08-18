import startupDNAService from '../services/startupDNA.service.js';
import prisma from '../lib/prisma.js';

export const getStartupDNA = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ success: false, code: 'PROJECT_NOT_FOUND', message: 'Project not found' });
    }

    const dna = await startupDNAService.getStartupDNA(projectId);

    return res.status(200).json({
      success: true,
      data: dna,
    });
  } catch (error) {
    console.error('Error getting Startup DNA:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const generateStartupDNA = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ success: false, code: 'PROJECT_NOT_FOUND', message: 'Project not found' });
    }

    // Check if already in progress or completed
    const existingDNA = await prisma.startupDNA.findUnique({ where: { projectId } });
    if (existingDNA && existingDNA.status === 'COMPLETED' && !req.body.regenerate) {
       return res.status(409).json({ success: false, code: 'ALREADY_GENERATED', message: 'Startup DNA already generated.' });
    }

    const newDNA = await startupDNAService.generateStartupDNA(projectId);

    return res.status(200).json({
      success: true,
      data: newDNA,
    });
  } catch (error) {
    console.error('Error generating Startup DNA:', error);
    if (error.status && error.code) {
      return res.status(error.status).json({ success: false, code: error.code, message: error.message });
    }
    // Check for zod validation errors
    if (error.name === 'ZodError') {
       return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'AI returned invalid data format' });
    }
    return res.status(500).json({ success: false, code: 'DNA_GENERATION_FAILED', message: 'Failed to generate Startup DNA.' });
  }
};

export const regenerateStartupDNA = async (req, res) => {
  req.body.regenerate = true;
  return generateStartupDNA(req, res);
};

export const askDNAQuestion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project || project.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const answer = await startupDNAService.askQuestion(projectId, question);

    return res.status(200).json({
      success: true,
      answer
    });
  } catch (error) {
    console.error('Error asking DNA question:', error);
    if (error.status && error.code) {
      return res.status(error.status).json({ success: false, code: error.code, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
