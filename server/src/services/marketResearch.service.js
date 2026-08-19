import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { buildMarketResearchPrompt } from '../prompts/marketResearch.prompt.js';
import { marketResearchGenerationSchema } from '../validations/marketResearch.validation.js';
import { runRAG } from '../../rag/ragService.js';


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

  // We must fetch the project so runRAG has the correct variables
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) throw new Error('Project not found');

  const researchQueries = [
    `What are the current market trends, size, and growth projections for this industry?`,
    `Who are the main competitors and what are the major gaps in the market?`,
    `What are the demographics, psychographics, and pain points of the target audience?`
  ];

  const researchResults = [];
  for (const researchQuery of researchQueries) {
    const result = await runRAG({
      query: `Startup idea: ${project.description}\nIndustry: ${project.industry}\nResearch question: ${researchQuery}`,
      topK: 5
    });
    researchResults.push(result);
  }

  const researchContext = researchResults
    .map((result, i) => `RESEARCH AREA ${i + 1}\n\n${result.context || result.answer}`)
    .join(`\n========================================\n`);

  // We append BOTH the startup context and the RAG research evidence
  const prompt = buildMarketResearchPrompt(context, researchContext);

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

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) {
    throw new Error('Project context is missing.');
  }

  const report = await getMarketResearch(projectId);
  let context = "Startup has no market research report yet.";
  if (report) {
    context = JSON.stringify(report, null, 2);
  }

  // -----------------------------------------
  // Retrieve relevant research using RAG
  // -----------------------------------------

  console.log('\n========================================');
  console.log('RAG MARKET RESEARCH CHAT SEARCH');
  console.log('========================================');
  console.log('Question:', question);

  const ragResult = await runRAG({
    query: `
      Startup idea:
      ${project.description}

      Industry:
      ${project.industry}

      Startup stage:
      ${project.startupStage}

      Founder question:
      ${question}
    `,
    topK: 5
  });

  const researchContext = ragResult?.context || ragResult?.answer || '';
  console.log('RAG research retrieved successfully.');

  const prompt = `You are a Market Analyst expert advising a startup founder.

==============================
STARTUP CONTEXT
==============================
Here is their current market research report context:
${context}

==============================
RESEARCH EVIDENCE
==============================
The following research evidence was retrieved from the database to help answer the question:
${researchContext}

==============================
FOUNDER QUESTION
==============================
The founder asks: "${question}"

Provide a concise, insightful, and strategic answer based on the provided context and research evidence. Do not use generic filler.`;

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
