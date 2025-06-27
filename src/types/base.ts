import { z } from 'zod';

export const functionToolSchema = z.object({
    type: z.literal('function'),
    function: z.object({
    name: z.string().min(1).regex(/^[a-zA-Z0-9_]+$/, "Invalid tool name"),
    description: z.string().min(10, "Description too short"),
    parameters: z.object({
      type: z.literal('object'),
      properties: z.record(z.string(), z.any()),
      required: z.array(z.string()).optional(),
    })
  })
});

export const generateConfigSchema = z.object({
  model: z.string().optional(),
  system: z.string().min(1),
  prompt: z.string().min(1),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8000).optional(),
  maxSteps: z.number().min(1).max(20).default(10),
  tools: z.array(functionToolSchema).optional(),
  streaming: z.boolean().default(false),
});

export type FunctionTool = z.infer<typeof functionToolSchema>;
export type GenerateConfig = z.infer<typeof generateConfigSchema>;