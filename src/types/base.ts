import { z } from 'zod';

export const toolParameterSchema = z.object({
  type: z.string(),
  description: z.string().optional(),
  enum: z.array(z.string()).optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  format: z.string().optional()
});

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

export type FunctionTool = z.infer<typeof functionToolSchema>;

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

export type GenerateConfig = z.infer<typeof generateConfigSchema>;

export const toolExecutionResultSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    type: z.string(),
    message: z.string(),
    code: z.string().optional()
  }).optional(),
  metadata: z.object({
    toolName: z.string(),
    executionId: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    duration: z.number()
  })
});

export type ToolExecutionResult = z.infer<typeof toolExecutionResultSchema>;

