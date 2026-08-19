import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { generatePitchDeckPrompt, askPitchDeckQuestionPrompt } from '../prompts/pitchDeck.prompt.js';
import { pitchDeckGenerationSchema } from '../validations/pitchDeck.validation.js';

class PitchDeckService {
  async getPitchDeck(projectId) {
    const pitchDeck = await prisma.pitchDeck.findUnique({
      where: { projectId },
    });
    return pitchDeck;
  }

  async generatePitchDeck(projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        startupOverview: true,
        ideaValidation: true,
        startupDNA: true,
        businessPlan: true,
        mvpPlan: true,
        branding: true,
      },
    });

    if (!project) {
      throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };
    }

    if (!project.startupOverview) {
      throw { status: 409, code: 'OVERVIEW_REQUIRED', message: 'Generate your Startup Overview before creating a Pitch Deck.' };
    }

    const prompt = generatePitchDeckPrompt(
      project,
      project.startupOverview,
      project.ideaValidation,
      project.startupDNA,
      project.businessPlan,
      project.mvpPlan,
      project.branding
    );

    const rawJsonResult = await fetchFromAIWithRetry(prompt);
    const jsonResult = pitchDeckGenerationSchema.parse(rawJsonResult);

    const dataPayload = {
      title: jsonResult.title,
      slides: jsonResult.slides,
      theme: jsonResult.theme,
    };

    const pitchDeck = await prisma.pitchDeck.upsert({
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
        action: 'PITCH_DECK_GENERATED',
        entityType: 'PROJECT',
        entityId: projectId,
      },
    });

    return pitchDeck;
  }

  async askQuestion(projectId, question, userId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) throw { status: 404, message: 'Project not found' };

    const pitchDeck = await prisma.pitchDeck.findUnique({ where: { projectId } });

    const chatHistory = await prisma.chatMessage.findMany({
      where: { projectId, module: 'PITCH_DECK' },
      orderBy: { createdAt: 'asc' },
      take: 10
    });

    const prompt = askPitchDeckQuestionPrompt(question, pitchDeck, chatHistory);
    const answer = await generateText(prompt);

    await prisma.chatMessage.createMany({
      data: [
        { projectId, module: 'PITCH_DECK', role: 'USER', content: question },
        { projectId, module: 'PITCH_DECK', role: 'AI', content: answer }
      ]
    });

    return answer;
  }

  async deletePitchDeck(projectId) {
    const pitchDeck = await prisma.pitchDeck.findUnique({
      where: { projectId },
    });

    if (!pitchDeck) {
      throw { status: 404, code: 'PITCH_DECK_NOT_FOUND', message: 'Pitch Deck not found' };
    }

    await prisma.pitchDeck.delete({
      where: { projectId },
    });

    return { message: 'Pitch Deck deleted successfully' };
  }
}

export default new PitchDeckService();
