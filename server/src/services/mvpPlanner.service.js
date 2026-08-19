import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { generateMVPPlannerPrompt } from '../prompts/mvpPlanner.prompt.js';
import { mvpPlannerGenerationSchema } from '../validations/mvpPlanner.validation.js';

const calculateDeterministicMVPScore = (mvpData, ideaValidation) => {
  // 1. Feature Completeness (0.35)
  // Base it on a healthy mix: MVP should have 3-6 must-haves. 
  const mustHaveCount = Array.isArray(mvpData.mustHaveFeatures) ? mvpData.mustHaveFeatures.length : 0;
  let featureCompleteness = 0;
  if (mustHaveCount >= 3 && mustHaveCount <= 6) featureCompleteness = 100;
  else if (mustHaveCount > 0) featureCompleteness = Math.max(40, 100 - (Math.abs(mustHaveCount - 4.5) * 15));
  else featureCompleteness = 20;

  // 2. Technical Feasibility (0.25)
  // Calculate based on complexity of Must-Have features
  let highComplexity = 0;
  let medComplexity = 0;
  if (Array.isArray(mvpData.mustHaveFeatures)) {
    mvpData.mustHaveFeatures.forEach(f => {
      const comp = f.estimatedComplexity?.toLowerCase();
      if (comp === 'high') highComplexity++;
      else if (comp === 'medium') medComplexity++;
    });
  }
  let techFeasibility = 100 - (highComplexity * 15) - (medComplexity * 5);
  techFeasibility = Math.max(30, Math.min(100, techFeasibility));

  // 3. Resource/Timeline Readiness (0.20)
  // Inverse of total feature count (too many features = lower readiness)
  const totalFeatures = mustHaveCount + 
    (Array.isArray(mvpData.shouldHaveFeatures) ? mvpData.shouldHaveFeatures.length : 0) +
    (Array.isArray(mvpData.couldHaveFeatures) ? mvpData.couldHaveFeatures.length : 0);
  let timelineReadiness = 100 - Math.max(0, (totalFeatures - 10) * 5);
  timelineReadiness = Math.max(30, Math.min(100, timelineReadiness));

  // 4. Market Validation Signal (0.20)
  // From Idea Validation if available
  const marketValidation = ideaValidation?.validationScore || 75;

  // Final Formula
  const finalScore = Math.round(
    (featureCompleteness * 0.35) +
    (techFeasibility * 0.25) +
    (timelineReadiness * 0.20) +
    (marketValidation * 0.20)
  );

  return Math.max(10, Math.min(100, finalScore));
};

export const generateMVPPlan = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      startupOverview: true,
      ideaValidation: true,
      startupDNA: true,
      businessPlan: true
    }
  });

  if (!project) throw new Error('Project not found or access denied.');
  if (!project.startupOverview) throw new Error('Startup overview is required.');

  const prompt = generateMVPPlannerPrompt(
    project,
    project.ideaValidation,
    project.startupDNA,
    project.businessPlan
  );

  const rawMvpData = await fetchFromAIWithRetry(prompt);
  const mvpData = mvpPlannerGenerationSchema.parse(rawMvpData);

  const readinessScore = calculateDeterministicMVPScore(mvpData, project.ideaValidation);

  const mvpPlan = await prisma.mVPPlan.upsert({
    where: { projectId },
    update: {
      status: 'COMPLETED',
      objective: mvpData.objective || '',
      coreUser: mvpData.coreUser || '',
      problem: mvpData.problem || '',
      valueProposition: mvpData.valueProposition || '',
      mustHaveFeatures: mvpData.mustHaveFeatures || [],
      shouldHaveFeatures: mvpData.shouldHaveFeatures || [],
      couldHaveFeatures: mvpData.couldHaveFeatures || [],
      laterFeatures: mvpData.laterFeatures || [],
      userFlow: mvpData.userFlow || [],
      roadmap: mvpData.roadmap || [],
      successMetrics: mvpData.successMetrics || [],
      launchChecklist: mvpData.launchChecklist || [],
      readinessScore
    },
    create: {
      projectId,
      status: 'COMPLETED',
      objective: mvpData.objective || '',
      coreUser: mvpData.coreUser || '',
      problem: mvpData.problem || '',
      valueProposition: mvpData.valueProposition || '',
      mustHaveFeatures: mvpData.mustHaveFeatures || [],
      shouldHaveFeatures: mvpData.shouldHaveFeatures || [],
      couldHaveFeatures: mvpData.couldHaveFeatures || [],
      laterFeatures: mvpData.laterFeatures || [],
      userFlow: mvpData.userFlow || [],
      roadmap: mvpData.roadmap || [],
      successMetrics: mvpData.successMetrics || [],
      launchChecklist: mvpData.launchChecklist || [],
      readinessScore
    }
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'GENERATED_MVP_PLAN',
      entityType: 'PROJECT',
      entityId: projectId
    }
  });

  return mvpPlan;
};

export const getMVPPlan = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  });

  if (!project) throw new Error('Project not found or access denied.');

  return await prisma.mVPPlan.findUnique({
    where: { projectId }
  });
};

export const deleteMVPPlan = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  });

  if (!project) throw new Error('Project not found or access denied.');

  return await prisma.mVPPlan.delete({
    where: { projectId }
  });
};

export const askMVPQuestion = async (projectId, userId, question) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { mvpPlan: true }
  });

  if (!project) throw new Error('Project not found or access denied.');
  
  const mvpPlan = project.mvpPlan;
  if (!mvpPlan) {
    throw new Error('MVP Plan must be generated first.');
  }

  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'MVP_PLANNER',
      role: 'USER',
      content: question,
    }
  });

  const prompt = `
You are Dream Builder AI, a startup technical advisor. 
You are answering a question from a founder based on their MVP Plan.
Use the following MVP Plan context to provide a direct, insightful, and concise answer.
Do not hallucinate external facts. Limit your response to 2-3 short paragraphs.
You may use **bold text** for emphasis.

--- MVP Plan ---
Objective: ${mvpPlan.objective}
Core User: ${mvpPlan.coreUser}
Problem: ${mvpPlan.problem}
Must Have Features: ${JSON.stringify(mvpPlan.mustHaveFeatures)}
Roadmap: ${JSON.stringify(mvpPlan.roadmap)}
---

Founder's Question: "${question}"

Answer concisely:
`;

  const answer = await generateText(prompt);

  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'MVP_PLANNER',
      role: 'AI',
      content: answer,
    }
  });

  return answer;
};
