import { z } from 'zod';

const featureSchema = z.object({
  name: z.string(),
  description: z.string(),
  priority: z.enum(['Must Have', 'Should Have', 'Could Have', 'Later']).or(z.string()),
  category: z.string(),
  reason: z.string(),
  estimatedComplexity: z.enum(['Low', 'Medium', 'High']).or(z.string())
});

export const mvpPlannerGenerationSchema = z.object({
  objective: z.string(),
  coreUser: z.string(),
  problem: z.string(),
  valueProposition: z.string(),
  mustHaveFeatures: z.array(featureSchema),
  shouldHaveFeatures: z.array(featureSchema),
  couldHaveFeatures: z.array(featureSchema),
  laterFeatures: z.array(featureSchema),
  userFlow: z.array(z.object({
    step: z.number().or(z.string()),
    name: z.string(),
    description: z.string()
  })),
  roadmap: z.array(z.object({
    phase: z.string(),
    name: z.string(),
    focus: z.string(),
    features: z.array(z.string())
  })),
  successMetrics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    target: z.string()
  })),
  launchChecklist: z.array(z.object({
    category: z.string(),
    tasks: z.array(z.string())
  }))
});
