import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { digitalTwinPrompt, askDigitalTwinQuestionPrompt } from '../prompts/digitalTwin.prompt.js';
import { digitalTwinGenerationSchema } from '../validations/digitalTwin.validations.js';

const DEFAULT_ASSUMPTIONS = {
  startingCustomers: 100,
  monthlyCustomerGrowth: 15,
  arpu: 29,
  conversionRate: 2,
  cac: 15,
  monthlyMarketingSpend: 2000,
  monthlyOperatingCost: 8000,
  customerRetention: 95,
  initialCapital: 150000,
  simulationDuration: 12
};

const getOptimistic = (base) => ({
  ...base,
  monthlyCustomerGrowth: Math.round(base.monthlyCustomerGrowth * 1.5),
  cac: Math.round(base.cac * 0.7),
  customerRetention: Math.min(99, base.customerRetention + 2)
});

const getConservative = (base) => ({
  ...base,
  monthlyCustomerGrowth: Math.round(base.monthlyCustomerGrowth * 0.5),
  cac: Math.round(base.cac * 1.5),
  customerRetention: Math.max(0, base.customerRetention - 5)
});

const runSimulation = (inputs) => {
  const duration = inputs.simulationDuration || 12;
  const growthRate = (inputs.monthlyCustomerGrowth || 0) / 100;
  const arpu = inputs.arpu || 0;
  const cac = inputs.cac || 0;
  const marketingSpend = inputs.monthlyMarketingSpend || 0;
  const operatingCost = inputs.monthlyOperatingCost || 0;
  const retentionRate = (inputs.customerRetention || 100) / 100;
  
  let currentCustomers = inputs.startingCustomers || 0;
  let currentCash = inputs.initialCapital || 0;
  
  const monthlyData = [];
  let breakEvenMonth = null;
  let runway = duration;
  let hasRunOut = false;

  for (let month = 1; month <= duration; month++) {
    const retainedCustomers = currentCustomers * retentionRate;
    let newCustomers = currentCustomers * growthRate;
    
    // Boost new customers from marketing spend if CAC is set
    if (cac > 0) {
      newCustomers += marketingSpend / cac;
    }

    currentCustomers = retainedCustomers + newCustomers;
    
    const revenue = currentCustomers * arpu;
    const acquisitionCost = newCustomers * cac;
    const totalCosts = marketingSpend + operatingCost + acquisitionCost;
    const profitLoss = revenue - totalCosts;
    
    currentCash = currentCash + profitLoss;

    monthlyData.push({
      month,
      customers: Math.round(currentCustomers),
      newCustomers: Math.round(newCustomers),
      revenue: Math.round(revenue),
      acquisitionCost: Math.round(acquisitionCost),
      totalCosts: Math.round(totalCosts),
      profitLoss: Math.round(profitLoss),
      cashBalance: Math.round(currentCash)
    });

    if (profitLoss > 0 && breakEvenMonth === null) {
      breakEvenMonth = month;
    }
    
    if (currentCash <= 0 && !hasRunOut) {
      runway = month;
      hasRunOut = true;
    }
  }

  return {
    monthlyData,
    summary: {
      runway: hasRunOut ? runway : `${duration}+`,
      breakEvenMonth: breakEvenMonth || 'Not achieved',
      endingCash: Math.round(currentCash),
      endingCustomers: Math.round(currentCustomers)
    }
  };
};

export const getDigitalTwin = async (projectId) => {
  return await prisma.digitalTwin.findUnique({
    where: { projectId }
  });
};

export const simulateScenario = async (projectId, customAssumptions = null) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { businessPlan: true, mvpPlan: true }
  });

  if (!project) throw new Error('Project not found');

  let twin = await prisma.digitalTwin.findUnique({ where: { projectId } });
  
  let base = twin?.baseAssumptions;
  if (!base) {
    base = DEFAULT_ASSUMPTIONS;
  }

  const optimistic = getOptimistic(base);
  const conservative = getConservative(base);
  
  let mergedCustom = twin?.customAssumptions;
  if (customAssumptions) {
    mergedCustom = { ...base, ...customAssumptions };
  }

  const simulationResults = {
    base: runSimulation(base),
    optimistic: runSimulation(optimistic),
    conservative: runSimulation(conservative),
    custom: mergedCustom ? runSimulation(mergedCustom) : null
  };

  const data = {
    projectId,
    baseAssumptions: base,
    optimisticAssumptions: optimistic,
    conservativeAssumptions: conservative,
    customAssumptions: mergedCustom || null,
    simulationResults
  };

  if (twin) {
    twin = await prisma.digitalTwin.update({
      where: { projectId },
      data
    });
  } else {
    twin = await prisma.digitalTwin.create({ data });
  }

  return twin;
};

export const generateInsights = async (projectId, scenarioKey = 'base') => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const twin = await prisma.digitalTwin.findUnique({ where: { projectId } });

  if (!twin || !twin.simulationResults) {
    throw new Error('Simulation results not found. Run simulation first.');
  }

  const results = twin.simulationResults[scenarioKey];
  if (!results) {
    throw new Error(`Results for scenario ${scenarioKey} not found.`);
  }

  const prompt = digitalTwinPrompt(project, results, scenarioKey);
  const rawInsightsObj = await fetchFromAIWithRetry(prompt);
  const insightsObj = digitalTwinGenerationSchema.parse(rawInsightsObj);

  // Update twin with insights
  const updatedInsights = {
    ...(twin.insights || {}),
    [scenarioKey]: insightsObj
  };

  const updatedTwin = await prisma.digitalTwin.update({
    where: { projectId },
    data: { insights: updatedInsights }
  });

  return updatedTwin;
};

export const askQuestion = async (projectId, question, userId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  });

  if (!project) throw new Error('Project not found');

  const digitalTwin = await prisma.digitalTwin.findUnique({ where: { projectId } });

  const chatHistory = await prisma.chatMessage.findMany({
    where: { projectId, module: 'DIGITAL_TWIN' },
    orderBy: { createdAt: 'asc' },
    take: 10
  });

  const prompt = askDigitalTwinQuestionPrompt(question, digitalTwin, chatHistory);
  const answer = await generateText(prompt);

  await prisma.chatMessage.createMany({
    data: [
      { projectId, module: 'DIGITAL_TWIN', role: 'USER', content: question },
      { projectId, module: 'DIGITAL_TWIN', role: 'AI', content: answer }
    ]
  });

  return answer;
};
