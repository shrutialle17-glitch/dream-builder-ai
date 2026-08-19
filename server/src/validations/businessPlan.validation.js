import { z } from 'zod';

export const businessPlanGenerationSchema = z.object({
  executiveSummary: z.object({
    overview: z.string(),
    problem: z.string(),
    solution: z.string(),
    targetCustomer: z.string(),
    businessModel: z.string()
  }),
  marketOpportunity: z.object({
    category: z.string(),
    description: z.string(),
    segments: z.array(z.string()),
    drivers: z.array(z.string()),
    assessment: z.string()
  }),
  businessModel: z.object({
    type: z.string(),
    revenueStreams: z.array(z.object({
      name: z.string(),
      description: z.string(),
      pricingLogic: z.string(),
      importance: z.enum(['High', 'Medium', 'Low']).or(z.string())
    }))
  }),
  goToMarket: z.object({
    initialSegment: z.string(),
    channels: z.array(z.string()),
    salesStrategy: z.string(),
    launchStrategy: z.string(),
    partnershipOpportunities: z.array(z.string()),
    earlyTractionStrategy: z.string()
  }),
  competitivePositioning: z.object({
    advantage: z.string(),
    differentiation: z.array(z.string()),
    alternativeSolutions: z.array(z.string()),
    positioning: z.string()
  }),
  operations: z.array(z.object({
    category: z.string(),
    description: z.string(),
    importance: z.enum(['High', 'Medium', 'Low']).or(z.string())
  })),
  resources: z.array(z.object({
    type: z.string(),
    description: z.string(),
    criticality: z.enum(['High', 'Medium', 'Low']).or(z.string())
  })),
  costStructure: z.array(z.object({
    category: z.string(),
    description: z.string(),
    importance: z.enum(['High', 'Medium', 'Low']).or(z.string())
  })),
  growthStrategy: z.array(z.object({
    phase: z.string(),
    focus: z.string(),
    milestones: z.array(z.string())
  })),
  keyMetrics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    target: z.string(),
    importance: z.enum(['High', 'Medium', 'Low']).or(z.string())
  })),
  risks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(['High', 'Medium', 'Low']).or(z.string()),
    mitigation: z.string()
  })),
  recommendations: z.array(z.object({
    priority: z.enum(['High', 'Medium', 'Low']).or(z.string()),
    action: z.string(),
    reason: z.string()
  }))
});
