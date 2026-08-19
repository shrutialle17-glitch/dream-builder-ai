import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { generateBrandingPrompt, askBrandingQuestionPrompt } from '../prompts/branding.prompt.js';
import { brandingGenerationSchema } from '../validations/branding.validation.js';

class BrandingService {
  async getBranding(projectId) {
    const branding = await prisma.branding.findUnique({
      where: { projectId },
    });
    return branding;
  }

  async generateBranding(projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        startupOverview: true,
        ideaValidation: true,
        startupDNA: true,
        businessPlan: true,
        mvpPlan: true,
      },
    });

    if (!project) {
      throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };
    }

    if (!project.startupOverview) {
      throw { status: 409, code: 'OVERVIEW_REQUIRED', message: 'Generate your Startup Overview before creating a Brand Identity.' };
    }

    const prompt = generateBrandingPrompt(
      project,
      project.startupOverview,
      project.ideaValidation,
      project.startupDNA,
      project.businessPlan,
      project.mvpPlan
    );

    const rawJsonResult = await fetchFromAIWithRetry(prompt);
    const jsonResult = brandingGenerationSchema.parse(rawJsonResult);

    const dataPayload = {
      positioning: jsonResult.positioning,
      personality: jsonResult.personality,
      voice: jsonResult.voice,
      archetype: jsonResult.archetype,
      keywords: jsonResult.keywords,
      visualDirection: jsonResult.visualDirection,
      colorPalette: jsonResult.colorPalette,
      typography: jsonResult.typography,
      logoDirection: jsonResult.logoDirection,
      taglines: jsonResult.taglines,
      messaging: jsonResult.messaging,
      dos: jsonResult.dos,
      donts: jsonResult.donts,
    };

    const branding = await prisma.branding.upsert({
      where: { projectId },
      update: dataPayload,
      create: {
        projectId,
        ...dataPayload,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: project.userId,
        action: 'BRANDING_GENERATED',
        entityType: 'PROJECT',
        entityId: projectId,
      },
    });

    return branding;
  }

  async askQuestion(projectId, question, userId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) throw { status: 404, message: 'Project not found' };

    const branding = await prisma.branding.findUnique({ where: { projectId } });

    const chatHistory = await prisma.chatMessage.findMany({
      where: { projectId, module: 'BRANDING' },
      orderBy: { createdAt: 'asc' },
      take: 10
    });

    const prompt = askBrandingQuestionPrompt(question, branding, chatHistory);
    const answer = await generateText(prompt);

    await prisma.chatMessage.createMany({
      data: [
        { projectId, module: 'BRANDING', role: 'USER', content: question },
        { projectId, module: 'BRANDING', role: 'AI', content: answer }
      ]
    });

    return answer;
  }

  async deleteBranding(projectId) {
    const branding = await prisma.branding.findUnique({
      where: { projectId },
    });

    if (!branding) {
      throw { status: 404, code: 'BRANDING_NOT_FOUND', message: 'Branding not found' };
    }

    await prisma.branding.delete({
      where: { projectId },
    });

    return { message: 'Branding deleted successfully' };
  }
}

export default new BrandingService();
