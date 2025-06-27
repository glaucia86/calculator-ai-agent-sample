import { z } from 'zod';

export const modelConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.enum(['openai', 'anthropic', 'meta', 'xai', 'google']),
  capabilities: z.array(z.enum(['chat', 'completion', 'streaming', 'vision' , 'embedding', 'image', 'audio', 'function_calling'])),
  maxTokens: z.number(),
  costPer1kTokens: z.number().optional(),
  description: z.string()
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;

export const availableModels: Record<string, ModelConfig> = {
  gpt4o: {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    capabilities: ['chat', 'completion', 'function_calling', 'streaming', 'vision'],
    maxTokens: 8192,
    costPer1kTokens: 0.015,
    description: "Most capable model from OpenAI"
  },
  gpt4o_mini: {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    capabilities: ['chat', 'completion', 'function_calling', 'streaming'],
    maxTokens: 4096,
    costPer1kTokens: 0.005,
    description: "Lightweight version of GPT-4o, optimized for speed and cost"
  },
  claude_sonnet: {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    capabilities: ['chat', 'completion', 'function_calling', 'streaming'],
    maxTokens: 8192,
    costPer1kTokens: 0.018,
    description: "Claude 3.5 Sonnet model from Anthropic"
  }
};

export const defaultModel: ModelConfig = availableModels.gpt4o;