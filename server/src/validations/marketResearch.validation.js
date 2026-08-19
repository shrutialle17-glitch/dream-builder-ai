import { z } from 'zod';

export const marketResearchGenerationSchema = z.object({
  marketOverview: z.object({
    category: z.string(),
    industry: z.string(),
    summary: z.string(),
    drivers: z.array(z.string()),
    challenges: z.array(z.string())
  }),
  customerSegments: z.array(z.object({
    name: z.string(),
    needs: z.array(z.string()),
    painPoints: z.array(z.string()),
    buyingMotivation: z.string()
  })),
  trends: z.array(z.object({
    name: z.string(),
    status: z.enum(['emerging', 'growing', 'established', 'declining']).or(z.string()),
    description: z.string()
  })),
  competitors: z.array(z.object({
    name: z.string(),
    positioning: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    differentiation: z.string()
  })),
  positioning: z.object({
    xAxis: z.string(),
    yAxis: z.string(),
    hypothesis: z.string()
  }),
  opportunities: z.array(z.string()),
  risks: z.array(z.object({
    title: z.string(),
    impact: z.enum(['low', 'medium', 'high']).or(z.string()),
    likelihood: z.enum(['low', 'medium', 'high']).or(z.string()),
    mitigation: z.string()
  })),
  swot: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string())
  }),
  recommendations: z.array(z.object({
    title: z.string(),
    priority: z.enum(['low', 'medium', 'high']).or(z.string()),
    reason: z.string(),
    nextAction: z.string()
  })),
  validationQuestions: z.array(z.string())
});
