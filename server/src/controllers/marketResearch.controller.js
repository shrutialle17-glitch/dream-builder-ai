import * as marketResearchService from '../services/marketResearch.service.js';
import prisma from '../lib/prisma.js';

const getMarketResearch = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const report = await marketResearchService.getMarketResearch(projectId);
    res.json(report);
  } catch (error) {
    console.error('Error fetching market research:', error);
    res.status(500).json({ error: 'Failed to fetch market research' });
  }
};

const generateMarketResearch = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const report = await marketResearchService.generateMarketResearch(projectId);
    res.json(report);
  } catch (error) {
    console.error('Error generating market research:', error);
    res.status(500).json({ error: 'Failed to generate market research: ' + error.message });
  }
};

const deleteMarketResearch = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await marketResearchService.deleteMarketResearch(projectId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting market research:', error);
    res.status(500).json({ error: 'Failed to delete market research' });
  }
};

const askMarketResearchQuestion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }

    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    const answer = await marketResearchService.askQuestion(projectId, question, req.user.id);
    res.json({ success: true, data: { answer } });
  } catch (error) {
    console.error('Error asking market research question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
};

export {
  getMarketResearch,
  generateMarketResearch,
  deleteMarketResearch,
  askMarketResearchQuestion
};
