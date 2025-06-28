import { z } from 'zod';
import { logger } from '../utils/logger.js';

export class ValidationError extends Error {
  constructor(message: string, public issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown, context?: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = `Validation failed${context ? ` in ${context}` : ''}`;
      logger.error(message, { issues: error.issues, receivedData: data });
      throw new ValidationError(message, error.issues);
    }
    throw error;
  }
}

export function zodToOpenAIParams(schema: z.ZodObject<any>): any {
  const shape = schema.shape;
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    const zodType = value as any;
    
    if (zodType instanceof z.ZodNumber) {
      properties[key] = {
        type: "number",
        description: zodType.description || `Number parameter: ${key}`
      };
    } else if (zodType instanceof z.ZodString) {
      properties[key] = {
        type: "string", 
        description: zodType.description || `String parameter: ${key}`
      };
      
      if (zodType instanceof z.ZodEnum) {
        properties[key].enum = zodType.options;
      }
    } else if (zodType instanceof z.ZodEnum) {
      properties[key] = {
        type: "string",
        enum: zodType.options,
        description: zodType.description || `Enum parameter: ${key}`
      };
    } else if (zodType instanceof z.ZodArray) {
      properties[key] = {
        type: "array",
        description: zodType.description || `Array parameter: ${key}`
      };
    } else if (zodType instanceof z.ZodBoolean) {
      properties[key] = {
        type: "boolean",
        description: zodType.description || `Boolean parameter: ${key}`
      };
    }

    if (!zodType.isOptional()) {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined
  };
}