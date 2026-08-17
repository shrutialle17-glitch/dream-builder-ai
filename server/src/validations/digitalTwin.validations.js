import { z } from 'zod';

export const createDigitalTwinSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  persona: z.record(z.string(), z.any()).optional(),
  goals: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export const updateDigitalTwinSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  persona: z.record(z.string(), z.any()).optional(),
  goals: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});