import { z } from 'zod';

// Define o que a calculadora recebe
export const CalculatorInput = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  a: z.number(),
  b: z.number(),
});

// Define o que a calculadora retorna
export const CalculatorOutput = z.object({
  result: z.number(),
  explanation: z.string()
});

export type CalculatorInputType = z.infer<typeof CalculatorInput>;
export type CalculatorOutputType = z.infer<typeof CalculatorOutput>;

// Converter o Zod para formato OpenAPI (TODO - para melhorar a função)
export function zodToOpenAI(schema: z.ZodObject<any>) {
  const shape = schema.shape;
  const properties: any = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(shape)) {
    if (value instanceof z.ZodNumber) {
      properties[key] = { type: 'number' };
    } else if (value instanceof z.ZodEnum) {
      properties[key] = { type: 'string', enum: (value as any).options };
    }

    required.push(key);
  }

  return { type: 'object', properties, required };
}