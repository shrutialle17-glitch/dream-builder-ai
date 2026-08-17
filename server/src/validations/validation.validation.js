import { z } from 'zod';

const dimensionSchema = z.object({
  score: z.number().int().min(0).max(100),
  analysis: z.string().min(10)
});

export const ideaValidationResponseSchema = z.object({
  summary: z.string(),
  problemStrength: dimensionSchema,
  marketNeed: dimensionSchema,
  solutionFit: dimensionSchema,
  targetCustomerClarity: dimensionSchema,
  differentiation: dimensionSchema,
  competition: dimensionSchema,
  feasibility: dimensionSchema,
  scalability: dimensionSchema,
  executionComplexity: dimensionSchema,
  risk: dimensionSchema,
  strengths: z.array(z.object({
    title: z.string(),
    explanation: z.string()
  })),
  weaknesses: z.array(z.object({
    title: z.string(),
    explanation: z.string()
  })),
  opportunities: z.array(z.object({
    title: z.string(),
    explanation: z.string()
  })),
  risks: z.array(z.object({
    title: z.string(),
    severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    explanation: z.string()
  })),
  recommendations: z.array(z.object({
    number: z.number().int(),
    title: z.string(),
    explanation: z.string()
  }))
});
