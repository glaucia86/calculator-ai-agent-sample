import { z } from 'zod';

const clientConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8000).optional(),
  timeout: z.number().min(1000).optional(),
})