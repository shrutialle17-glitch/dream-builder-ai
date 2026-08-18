import prisma from '../lib/prisma.js';
import * as projectService from '../services/project.service.js';

export const getChatHistory = async (req, res, next) => {
  try {
    const { projectId, moduleType } = req.params;

    // Validate project ownership
    await projectService.getProjectById(projectId, req.user.id);

    // Validate moduleType is valid
    const validModules = ['IDEA_VALIDATION', 'STARTUP_DNA', 'BUSINESS_PLAN', 'MVP_PLANNER', 'BRANDING', 'PITCH_DECK', 'DIGITAL_TWIN', 'MARKET_RESEARCH'];
    if (!validModules.includes(moduleType)) {
      return res.status(400).json({ success: false, message: 'Invalid module type' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        projectId,
        module: moduleType,
      },
      orderBy: {
        createdAt: 'asc', // oldest to newest for chat history
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      }
    });

    // Format for frontend consumption (lowercase role)
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role.toLowerCase(), // 'user' or 'ai'
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    res.json({ success: true, data: formattedMessages });
  } catch (error) {
    next(error);
  }
};

export const clearChatHistory = async (req, res, next) => {
  try {
    const { projectId, moduleType } = req.params;

    await projectService.getProjectById(projectId, req.user.id);

    const validModules = ['IDEA_VALIDATION', 'STARTUP_DNA', 'BUSINESS_PLAN', 'MVP_PLANNER', 'BRANDING', 'PITCH_DECK', 'DIGITAL_TWIN', 'MARKET_RESEARCH'];
    if (!validModules.includes(moduleType)) {
      return res.status(400).json({ success: false, message: 'Invalid module type' });
    }

    await prisma.chatMessage.deleteMany({
      where: { projectId, module: moduleType },
    });

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    next(error);
  }
};
