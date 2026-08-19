import prisma from '../lib/prisma.js';
import { fetchFromAIWithRetry } from './ai.service.js';

const buildPitchDeckPrompt = (project) => `
You are an expert startup pitch deck strategist.

Create a professional investor-ready pitch deck for the following startup.

Startup:
Name: ${project.name}
Description: ${project.description || 'Not specified'}
Industry: ${project.industry || 'Not specified'}
Startup Stage: ${project.startupStage || 'Not specified'}

Return ONLY valid JSON. Do not use markdown or code blocks.

The JSON must follow exactly this structure:

{
  "problem": {
    "title": "Problem",
    "points": ["point 1", "point 2", "point 3"]
  },
  "solution": {
    "title": "Solution",
    "points": ["point 1", "point 2", "point 3"]
  },
  "market": {
    "title": "Market Opportunity",
    "description": "..."
  },
  "product": {
    "title": "Product",
    "description": "..."
  },
  "businessModel": {
    "title": "Business Model",
    "description": "..."
  },
  "competitiveAdvantage": {
    "title": "Competitive Advantage",
    "points": ["point 1", "point 2", "point 3"]
  },
  "goToMarket": {
    "title": "Go To Market",
    "points": ["point 1", "point 2", "point 3"]
  },
  "traction": {
    "title": "Traction",
    "points": ["point 1", "point 2", "point 3"]
  },
  "team": {
    "title": "Team",
    "description": "..."
  },
  "financials": {
    "title": "Financial Outlook",
    "description": "..."
  },
  "funding": {
    "title": "Funding Ask",
    "description": "..."
  }
}

Keep the content concise, realistic and suitable for an investor presentation.
Do not invent specific revenue, customer or funding numbers unless they are provided in the project information.
`;

export const getPitchDecks = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.pitchDeck.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPitchDeckById = async (
  projectId,
  pitchDeckId,
  userId
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const pitchDeck = await prisma.pitchDeck.findFirst({
    where: {
      id: pitchDeckId,
      projectId,
    },
  });

  if (!pitchDeck) {
    const error = new Error('Pitch deck not found');
    error.statusCode = 404;
    throw error;
  }

  return pitchDeck;
};

export const createPitchDeck = async (
  projectId,
  userId,
  data
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const pitchDeck = await prisma.pitchDeck.create({
    data: {
      projectId,
      title: data.title,
      content: data.content,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PITCH_DECK_CREATED',
      entityType: 'PITCH_DECK',
      entityId: pitchDeck.id,
      details: `Created pitch deck for project: ${project.name}`,
    },
  });

  return pitchDeck;
};

export const generatePitchDeck = async (
  projectId,
  userId
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const prompt = buildPitchDeckPrompt(project);

  const content = await fetchFromAIWithRetry(prompt);

  const pitchDeck = await prisma.pitchDeck.create({
    data: {
      projectId,
      title: `${project.name} - Investor Pitch Deck`,
      content,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PITCH_DECK_GENERATED',
      entityType: 'PITCH_DECK',
      entityId: pitchDeck.id,
      details: `AI generated pitch deck for project: ${project.name}`,
    },
  });

  return pitchDeck;
};

export const updatePitchDeck = async (
  projectId,
  pitchDeckId,
  userId,
  data
) => {
  await getPitchDeckById(
    projectId,
    pitchDeckId,
    userId
  );

  return prisma.pitchDeck.update({
    where: {
      id: pitchDeckId,
    },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.content !== undefined && {
        content: data.content,
      }),
    },
  });
};

export const deletePitchDeck = async (
  projectId,
  pitchDeckId,
  userId
) => {
  await getPitchDeckById(
    projectId,
    pitchDeckId,
    userId
  );

  await prisma.pitchDeck.delete({
    where: {
      id: pitchDeckId,
    },
  });

  return {
    success: true,
    message: 'Pitch deck deleted successfully',
  };
};