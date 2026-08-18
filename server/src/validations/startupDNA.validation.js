import { z } from 'zod';

export const startupDNAGenerationSchema = z.object({
  profile: z.object({
    name: z.string(),
    description: z.string(),
  }),
  dimensions: z.array(z.object({
    name: z.string(),
    rating: z.enum(["Weak", "Developing", "Promising", "Strong", "Exceptional"]),
    reason: z.string(),
  })),
  traits: z.array(z.object({
    name: z.string(),
    strength: z.number().min(0).max(100),
    description: z.string(),
  })),
  summary: z.string(),
  strengths: z.array(z.object({
    title: z.string(),
    description: z.string(),
    impact: z.enum(["Low", "Medium", "High"]),
  })),
  weaknesses: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(["Low", "Medium", "High"]),
  })),
  risks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    severity: z.enum(["Low", "Medium", "High"]),
    mitigation: z.string(),
  })),
  opportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    potential: z.enum(["Low", "Medium", "High"]),
  })),
  recommendations: z.array(z.object({
    priority: z.enum(["Low", "Medium", "High"]),
    action: z.string(),
    reason: z.string(),
  })),
});
