import { z } from 'zod';

export const aiStartupOverviewResponseSchema = z.object({
  summary: z.string().min(20).max(600),
  problem: z.string().min(10).max(400),
  solution: z.string().min(10).max(400),
  targetCustomer: z.string().min(10).max(300),
  valueProposition: z.string().min(10).max(300),
  keyUseCase: z.string().min(10).max(300),
  businessModelHypothesis: z.string().min(10).max(400),
  startupCategory: z.string().min(2).max(60),
});
