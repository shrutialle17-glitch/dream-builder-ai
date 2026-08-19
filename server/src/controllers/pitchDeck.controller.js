import PitchDeckService from '../services/pitchDeck.service.js';
import prisma from '../lib/prisma.js';

export const getPitchDeck = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const pitchDeck = await PitchDeckService.getPitchDeck(projectId);
    res.status(200).json({ success: true, data: pitchDeck || null });
  } catch (error) {
    next(error);
  }
};

export const generatePitchDeck = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const pitchDeck = await PitchDeckService.generatePitchDeck(projectId);
    res.status(200).json({ success: true, data: pitchDeck });
  } catch (error) {
    next(error);
  }
};

export const askPitchDeckQuestion = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    const answer = await PitchDeckService.askQuestion(projectId, question, req.user.id);
    res.status(200).json({ success: true, data: { answer } });
  } catch (error) {
    next(error);
  }
};

export const deletePitchDeck = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await PitchDeckService.deletePitchDeck(projectId);
    res.status(200).json({ success: true, message: 'Pitch Deck deleted successfully' });
  } catch (error) {
    next(error);
  }
};
