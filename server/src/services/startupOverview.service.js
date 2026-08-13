import prisma from '../lib/prisma.js';

import { generateJSON, fetchFromAIWithRetry } from './ai.service.js';
import { buildStartupOverviewPrompt } from '../prompts/startupOverview.prompt.js';
import { aiStartupOverviewResponseSchema } from '../validations/startupOverview.validation.js';

export const getStartupOverview = async (projectId) => {
  return await prisma.startupOverview.findUnique({
    where: { projectId }
  });
};

export const generateStartupOverview = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project not found');
  }

  // Check if overview already exists - we will upsert, but we can log it
  // (In-flight guard is handled in controller)

  const prompt = buildStartupOverviewPrompt(project);
  
  const rawAIResponse = await fetchFromAIWithRetry(prompt);

  // Validate the response using Zod
  const validationResult = aiStartupOverviewResponseSchema.safeParse(rawAIResponse);
  if (!validationResult.success) {
    console.error('Validation failed for AI output:', validationResult.error);
    throw new Error('AI_GENERATION_FAILED');
  }

  const validData = validationResult.data;

  // Upsert to DB
  const overview = await prisma.startupOverview.upsert({
    where: { projectId },
    update: validData,
    create: {
      projectId,
      ...validData
    }
  });
  // Mark the parent project as ACTIVE since an overview was generated
  await prisma.project.update({
    where: { id: projectId },
    data: { status: 'ACTIVE' }
  });

  return overview;
};
