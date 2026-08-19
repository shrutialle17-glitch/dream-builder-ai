import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { MARKET_RESEARCH_PROMPT } from '../prompts/marketResearch.prompt.js';
import { marketResearchGenerationSchema } from '../validations/marketResearch.validation.js';

/**
 * Gathers existing context about the startup to inform the Market Research.
 * RAG-ready: Later, we could add retrieveExternalSources() here to inject live data.
 */
const buildMarketResearchContext = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      startupOverview: true,
      ideaValidation: true,
      startupDNA: true,
      businessPlan: true,
      mvpPlan: true,
      branding: true,
      pitchDeck: true,
    }
  });

  if (!project) throw new Error("Project not found");

  let context = `Startup Name: ${project.name}\n`;
  if (project.description) context += `Description: ${project.description}\n`;
  if (project.industry) context += `Industry: ${project.industry}\n`;
  if (project.startupStage) context += `Stage: ${project.startupStage}\n\n`;

  if (project.startupOverview) {
    context += "=== STARTUP OVERVIEW ===\n";
    context += `Problem: ${project.startupOverview.problem}\n`;
    context += `Solution: ${project.startupOverview.solution}\n`;
    context += `Target Customer: ${project.startupOverview.targetCustomer}\n`;
    context += `Value Prop: ${project.startupOverview.valueProposition}\n\n`;
  }

  if (project.ideaValidation) {
    context += "=== IDEA VALIDATION ===\n";
    if (project.ideaValidation.strengths) context += `Strengths: ${JSON.stringify(project.ideaValidation.strengths)}\n`;
    if (project.ideaValidation.weaknesses) context += `Weaknesses: ${JSON.stringify(project.ideaValidation.weaknesses)}\n`;
    if (project.ideaValidation.risks) context += `Risks: ${JSON.stringify(project.ideaValidation.risks)}\n\n`;
  }

  if (project.businessPlan) {
    context += "=== BUSINESS PLAN ===\n";
    if (project.businessPlan.marketOpportunity) context += `Market Opportunity: ${JSON.stringify(project.businessPlan.marketOpportunity)}\n`;
    if (project.businessPlan.competitivePositioning) context += `Competitive Positioning: ${JSON.stringify(project.businessPlan.competitivePositioning)}\n\n`;
  }

  if (project.startupDNA) {
    context += "=== STARTUP DNA ===\n";
    if (project.startupDNA.profileDescription) context += `Profile: ${project.startupDNA.profileDescription}\n\n`;
  }

  // Future RAG data would be appended here

  return context;
};

const generateMarketResearch = async (projectId) => {
  const context = await buildMarketResearchContext(projectId);
  const prompt = `${MARKET_RESEARCH_PROMPT}\n\n${context}`;

  const rawParsedData = await fetchFromAIWithRetry(prompt);
  const parsedData = marketResearchGenerationSchema.parse(rawParsedData);

  const result = await prisma.marketResearch.upsert({
    where: { projectId },
    update: {
      marketOverview: parsedData.marketOverview,
      customerSegments: parsedData.customerSegments,
      trends: parsedData.trends,
      competitors: parsedData.competitors,
      positioning: parsedData.positioning,
      opportunities: parsedData.opportunities,
      risks: parsedData.risks,
      swot: parsedData.swot,
      recommendations: parsedData.recommendations,
      validationQuestions: parsedData.validationQuestions
    },
    create: {
      projectId,
      marketOverview: parsedData.marketOverview,
      customerSegments: parsedData.customerSegments,
      trends: parsedData.trends,
      competitors: parsedData.competitors,
      positioning: parsedData.positioning,
      opportunities: parsedData.opportunities,
      risks: parsedData.risks,
      swot: parsedData.swot,
      recommendations: parsedData.recommendations,
      validationQuestions: parsedData.validationQuestions
    }
  });

  return result;
};

const getMarketResearch = async (projectId) => {
  return await prisma.marketResearch.findUnique({
    where: { projectId }
  });
};

const deleteMarketResearch = async (projectId) => {
  return await prisma.marketResearch.delete({
    where: { projectId }
  });
};

const askQuestion = async (projectId, question, userId) => {
  // Save user question to chat history
  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'MARKET_RESEARCH',
      role: 'USER',
      content: question
    }
  });

  const report = await getMarketResearch(projectId);
  let context = "Startup has no market research report yet.";
  if (report) {
    context = JSON.stringify(report, null, 2);
  }

  const prompt = `You are a Market Analyst expert advising a startup founder.
Here is their current market research report context:
${context}

The founder asks: "${question}"

Provide a concise, insightful, and strategic answer. Do not use markdown wrapping like \`\`\`json.`;

  const answer = await generateText(prompt, { temperature: 0.7 });

  // Save AI answer to chat history
  await prisma.chatMessage.create({
    data: {
      projectId,
      module: 'MARKET_RESEARCH',
      role: 'AI',
      content: answer
    }
  });

  return answer;
};

export {
  buildMarketResearchContext,
  generateMarketResearch,
  getMarketResearch,
  deleteMarketResearch,
  askQuestion
};
