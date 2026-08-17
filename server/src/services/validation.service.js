import prisma from '../lib/prisma.js';
import { generateJSON, generateText, fetchFromAIWithRetry } from './ai.service.js';
import { buildIdeaValidationPrompt } from '../prompts/validation.prompt.js';
import { ideaValidationResponseSchema } from '../validations/validation.validation.js';

const VALIDATION_WEIGHTS = {

  problemStrength: 0.14,
  marketNeed: 0.12,
  solutionFit: 0.14,
  targetCustomerClarity: 0.08,
  differentiation: 0.10,
  competition: 0.10,
  feasibility: 0.10,
  scalability: 0.08,
  executionComplexity: 0.08,
  risk: 0.06
};

export const getIdeaValidation = async (projectId) => {
  return await prisma.ideaValidation.findUnique({
    where: { projectId }
  });
};

export const generateIdeaValidation = async (projectId) => {
  // Update status to GENERATING
  await prisma.ideaValidation.upsert({
    where: { projectId },
    update: { status: 'GENERATING' },
    create: { projectId, status: 'GENERATING' }
  });

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { startupOverview: true }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (!project.startupOverview) {
      throw new Error('OVERVIEW_REQUIRED');
    }

    const prompt = buildIdeaValidationPrompt(project, project.startupOverview);
    
    const rawAIResponse = await fetchFromAIWithRetry(prompt, 1, 2000, 45000);

    const validationResult = ideaValidationResponseSchema.safeParse(rawAIResponse);
    if (!validationResult.success) {
      console.error('Validation failed for AI output:', validationResult.error);
      throw new Error('AI_GENERATION_FAILED');
    }

    const validData = validationResult.data;

    // Calculate deterministic score
    let validationScore = 0;
    for (const [key, weight] of Object.entries(VALIDATION_WEIGHTS)) {
      validationScore += (validData[key].score * weight);
    }
    validationScore = Math.round(validationScore);

    const updateData = {
      status: 'COMPLETED',
      validationScore,
      summary: validData.summary,
      problemStrengthScore: validData.problemStrength.score,
      problemStrengthAnalysis: validData.problemStrength.analysis,
      marketNeedScore: validData.marketNeed.score,
      marketNeedAnalysis: validData.marketNeed.analysis,
      solutionFitScore: validData.solutionFit.score,
      solutionFitAnalysis: validData.solutionFit.analysis,
      targetCustomerClarityScore: validData.targetCustomerClarity.score,
      targetCustomerClarityAnalysis: validData.targetCustomerClarity.analysis,
      differentiationScore: validData.differentiation.score,
      differentiationAnalysis: validData.differentiation.analysis,
      competitionScore: validData.competition.score,
      competitionAnalysis: validData.competition.analysis,
      feasibilityScore: validData.feasibility.score,
      feasibilityAnalysis: validData.feasibility.analysis,
      scalabilityScore: validData.scalability.score,
      scalabilityAnalysis: validData.scalability.analysis,
      executionComplexityScore: validData.executionComplexity.score,
      executionComplexityAnalysis: validData.executionComplexity.analysis,
      riskScore: validData.risk.score,
      riskAnalysis: validData.risk.analysis,
      strengths: validData.strengths,
      weaknesses: validData.weaknesses,
      opportunities: validData.opportunities,
      risks: validData.risks,
      recommendations: validData.recommendations,
    };

    const validation = await prisma.ideaValidation.upsert({
      where: { projectId },
      update: updateData,
      create: {
        projectId,
        ...updateData
      }
    });

    return validation;
  } catch (error) {
    await prisma.ideaValidation.update({
      where: { projectId },
      data: { status: 'FAILED' }
    }).catch(e => console.error("Failed to update status to FAILED:", e));
    throw error;
  }
};

export const askValidationQuestion = async (projectId, question) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { startupOverview: true, ideaValidation: true }
  });

  if (!project || !project.startupOverview || !project.ideaValidation) {
    throw new Error('Project context is missing or validation not completed.');
  }

  // 1. Save user question
  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'IDEA_VALIDATION',
      role: 'USER',
      content: question,
    }
  });

  const prompt = `
You are Dream Builder AI, an expert startup strategist.
The founder of ${project.name} is looking at their Idea Validation report and has asked a question.

Here is the context about their startup:
Idea: ${project.description}
Industry: ${project.industry}
Stage: ${project.startupStage}

Startup Overview:
${JSON.stringify(project.startupOverview, null, 2)}

Idea Validation Results:
Score: ${project.ideaValidation.validationScore}/100
Strengths: ${JSON.stringify(project.ideaValidation.strengths)}
Weaknesses: ${JSON.stringify(project.ideaValidation.weaknesses)}
Risks: ${JSON.stringify(project.ideaValidation.risks)}
Recommendations: ${JSON.stringify(project.ideaValidation.recommendations)}

The Founder asks:
"${question}"

Provide a concise, direct, and highly strategic answer. Do not use generic filler. Act like a top-tier startup consultant advising this specific founder based on the provided context. Format using simple text/markdown (keep it brief, 1-3 short paragraphs).
`;

  const answer = await generateText(prompt);

  // 2. Save AI answer
  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'IDEA_VALIDATION',
      role: 'AI',
      content: answer,
    }
  });

  return answer;
};
