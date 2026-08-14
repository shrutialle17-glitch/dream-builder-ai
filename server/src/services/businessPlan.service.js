import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { generateBusinessPlanPrompt } from '../prompts/businessPlan.prompt.js';
import { businessPlanGenerationSchema } from '../validations/businessPlan.validation.js';

export const generateBusinessPlan = async (projectId, userId) => {
  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      startupOverview: true,
      ideaValidation: true,
      startupDNA: true,
      businessPlan: true
    }
  });

  if (!project) {
    throw new Error('Project not found or access denied.');
  }

  if (!project.startupOverview) {
    throw new Error('Startup overview is required to generate a Business Plan.');
  }

  // Generate prompt
  const prompt = generateBusinessPlanPrompt(project, project.ideaValidation, project.startupDNA);

  // Call Gemini and get structured JSON
  const rawBusinessPlanData = await fetchFromAIWithRetry(prompt);
  const businessPlanData = businessPlanGenerationSchema.parse(rawBusinessPlanData);

  // Update or create
  const businessPlan = await prisma.businessPlan.upsert({
    where: { projectId },
    update: {
      status: 'COMPLETED',
      executiveSummary: businessPlanData.executiveSummary || {},
      marketOpportunity: businessPlanData.marketOpportunity || {},
      businessModel: businessPlanData.businessModel || {},
      goToMarket: businessPlanData.goToMarket || {},
      competitivePositioning: businessPlanData.competitivePositioning || {},
      operations: businessPlanData.operations || [],
      resources: businessPlanData.resources || [],
      costStructure: businessPlanData.costStructure || [],
      growthStrategy: businessPlanData.growthStrategy || [],
      keyMetrics: businessPlanData.keyMetrics || [],
      risks: businessPlanData.risks || [],
      recommendations: businessPlanData.recommendations || []
    },
    create: {
      projectId,
      status: 'COMPLETED',
      executiveSummary: businessPlanData.executiveSummary || {},
      marketOpportunity: businessPlanData.marketOpportunity || {},
      businessModel: businessPlanData.businessModel || {},
      goToMarket: businessPlanData.goToMarket || {},
      competitivePositioning: businessPlanData.competitivePositioning || {},
      operations: businessPlanData.operations || [],
      resources: businessPlanData.resources || [],
      costStructure: businessPlanData.costStructure || [],
      growthStrategy: businessPlanData.growthStrategy || [],
      keyMetrics: businessPlanData.keyMetrics || [],
      risks: businessPlanData.risks || [],
      recommendations: businessPlanData.recommendations || []
    }
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'GENERATED_BUSINESS_PLAN',
      entityType: 'PROJECT',
      entityId: projectId
    }
  });

  return businessPlan;
};

export const getBusinessPlan = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  });

  if (!project) throw new Error('Project not found or access denied.');

  return await prisma.businessPlan.findUnique({
    where: { projectId }
  });
};

export const deleteBusinessPlan = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  });

  if (!project) throw new Error('Project not found or access denied.');

  return await prisma.businessPlan.delete({
    where: { projectId }
  });
};

export const askBusinessPlanQuestion = async (projectId, userId, question) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { businessPlan: true }
  });

  if (!project) throw new Error('Project not found or access denied.');
  
  const businessPlan = project.businessPlan;
  if (!businessPlan) {
    throw new Error('Business Plan must be generated first.');
  }

  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'BUSINESS_PLAN',
      role: 'USER',
      content: question,
    }
  });

  const prompt = `
You are Dream Builder AI, a startup advisor. 
You are answering a question from a founder based on their Business Plan.
Use the following Business Plan context to provide a direct, insightful, and concise answer.
Do not hallucinate external facts. Limit your response to 2-3 short paragraphs.
You may use **bold text** for emphasis.

--- Business Plan ---
Executive Summary: ${JSON.stringify(businessPlan.executiveSummary)}
Business Model: ${JSON.stringify(businessPlan.businessModel)}
Go To Market: ${JSON.stringify(businessPlan.goToMarket)}
Recommendations: ${JSON.stringify(businessPlan.recommendations)}
---

Founder's Question: "${question}"

Answer concisely:
`;

  const answer = await generateText(prompt);

  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'BUSINESS_PLAN',
      role: 'AI',
      content: answer,
    }
  });

  return answer;
};
