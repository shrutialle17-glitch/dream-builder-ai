import prisma from '../lib/prisma.js';
import { generateText, fetchFromAIWithRetry } from './ai.service.js';
import { generateStartupDNAPrompt } from '../prompts/startupDNA.prompt.js';
import { startupDNAGenerationSchema } from '../validations/startupDNA.validation.js';

const RATING_SCORES = {
  Weak: 25,
  Developing: 50,
  Promising: 72,
  Strong: 85,
  Exceptional: 95,
};

const DIMENSION_WEIGHTS = {
  'Problem Strength': 0.12,
  'Solution Clarity': 0.10,
  'Market Potential': 0.12,
  'Differentiation': 0.10,
  'Business Model Strength': 0.12,
  'Scalability': 0.10,
  'Innovation': 0.08,
  'Execution Feasibility': 0.10,
  'Customer Clarity': 0.08,
  'Growth Potential': 0.08,
};

class StartupDNAService {
  async getStartupDNA(projectId) {
    const dna = await prisma.startupDNA.findUnique({
      where: { projectId },
    });
    return dna;
  }

  async generateStartupDNA(projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        startupOverview: true,
        ideaValidation: true,
      },
    });

    if (!project) {
      throw { status: 404, code: 'PROJECT_NOT_FOUND', message: 'Project not found' };
    }

    if (!project.startupOverview) {
      throw { status: 409, code: 'OVERVIEW_REQUIRED', message: 'Generate your Startup Overview before creating a Startup DNA profile.' };
    }

    const prompt = generateStartupDNAPrompt(project, project.startupOverview, project.ideaValidation);

    const jsonResult = await fetchFromAIWithRetry(prompt);

    const parsedResult = startupDNAGenerationSchema.parse(jsonResult);

    // Map ratings to scores and calculate weighted average
    let overallScoreRaw = 0;
    const scoredDimensions = parsedResult.dimensions.map((dim) => {
      const score = RATING_SCORES[dim.rating] || 50;
      const weight = DIMENSION_WEIGHTS[dim.name] || 0.10;
      overallScoreRaw += score * weight;
      return { ...dim, score };
    });

    const overallScore = Math.round(overallScoreRaw);

    const dataPayload = {
      profileName: parsedResult.profile.name,
      profileDescription: parsedResult.profile.description,
      overallScore,
      summary: parsedResult.summary,
      dimensions: scoredDimensions,
      traits: parsedResult.traits,
      strengths: parsedResult.strengths,
      weaknesses: parsedResult.weaknesses,
      risks: parsedResult.risks,
      opportunities: parsedResult.opportunities,
      recommendations: parsedResult.recommendations,
      status: 'COMPLETED',
    };

    const savedDNA = await prisma.startupDNA.upsert({
      where: { projectId },
      update: dataPayload,
      create: {
        projectId,
        ...dataPayload,
      },
    });

    return savedDNA;
  }

  async askQuestion(projectId, question) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        startupDNA: true,
      },
    });

    if (!project || !project.startupDNA || project.startupDNA.status !== 'COMPLETED') {
      throw { status: 400, code: 'DNA_NOT_COMPLETED', message: 'Startup DNA must be completed first.' };
    }

    // 1. Save user question
    await prisma.chatMessage.create({
      data: {
        projectId,
        module: 'STARTUP_DNA',
        role: 'USER',
        content: question,
      }
    });

    const { startupDNA } = project;

    const prompt = `
You are Dream Builder AI, a startup advisor. 
You are answering a question from a founder based on their Startup DNA profile.
Use the following Startup DNA profile context to provide a direct, insightful, and concise answer.
Do not hallucinate external facts. Limit your response to 2-3 short paragraphs.
You may use **bold text** for emphasis.

--- Startup DNA Profile ---
Profile Name: ${startupDNA.profileName}
Overall Score: ${startupDNA.overallScore}/100
Summary: ${startupDNA.summary}

Strengths:
${startupDNA.strengths.map(s => `- ${s.title}: ${s.description}`).join('\n')}

Weaknesses:
${startupDNA.weaknesses.map(w => `- ${w.title}: ${w.description}`).join('\n')}

Risks:
${startupDNA.risks.map(r => `- ${r.title}: ${r.description} (Mitigation: ${r.mitigation})`).join('\n')}

---

Founder's Question: "${question}"

Answer concisely:
`;

    const answer = await generateText(prompt);

    // 2. Save AI answer
    await prisma.chatMessage.create({
      data: {
        projectId,
        module: 'STARTUP_DNA',
        role: 'AI',
        content: answer,
      }
    });

    return answer;
  }
}

export default new StartupDNAService();
