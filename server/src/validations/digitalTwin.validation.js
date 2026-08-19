import { z } from 'zod';

export const digitalTwinGenerationSchema = z.object({
  summary: z.string(),
  keyChanges: z.array(z.object({
    metric: z.string(),
    change: z.string(),
    reason: z.string()
  })),
  risks: z.array(z.object({
    title: z.string(),
    severity: z.enum(['low', 'medium', 'high']).or(z.string()),
    description: z.string()
  })),
  opportunities: z.array(z.object({
    title: z.string(),
    description: z.string()
  })),
  recommendations: z.array(z.object({
    title: z.string(),
    reason: z.string(),
    priority: z.enum(['low', 'medium', 'high']).or(z.string())
  }))
});
