import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  startupStage: z.string().optional(),
  status: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
