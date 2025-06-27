import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  AI_TEMPERATURE: z.number().min(0).max(2).default(0.7),
  AI_MAX_TOKENS: z.coerce.number().min(1).max(8000).default(300),
  AI_TIMEOUT_MS: z.coerce.number().min(1000).default(30000),
  DEFAULT_MODEL: z.string().default('openai/gpt-4o'),
  FALLBACK_MODEL: z.string().default('openai/gpt-4o-mini'),
});

export type Environment = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);