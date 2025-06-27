import { z } from 'zod';

export const calculatorInputSchema = z.object({
  a: z.number().describe('First number'),
  b: z.number().describe('Second number'),
});

export const advancedCalculatorInputSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('Operation to perform'),
  a: z.number(),
  b: z.number(),
  precision: z.number().int().min(0).max(10).default(2).optional()
});

export const calculatorOutputSchema = z.object({
  result: z.number(),
  operation: z.string(),
  message: z.string(),
  timestamp: z.string().datetime()
});

export const textAnalyzerInputSchema = z.object({
  text: z.string().min(1).max(10000),
  analysisTypes: z.array(z.enum(['basic', 'sentiment', 'readability'])).optional(),
  language: z.enum(['en', 'es', 'fr', 'auto']).default('auto'),
});

export const textAnalyzerOutputSchema = z.object({
  text: z.string(),
  analysis: z.object({
    characterCount: z.number(),
    wordCount: z.number(),
    sentenceCount: z.number(),
    averageWordsPerSentence: z.number(),
    sentiment: z.object({
      overall: z.enum(['positive', 'negative', 'neutral']),
      confidence: z.number().min(0).max(1),
      positiveWords: z.number(),
      negativeWords: z.number()
    }).optional(),
  }),
    language: z.string(),
    timestamp: z.string().datetime()
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type AdvancedCalculatorInput = z.infer<typeof advancedCalculatorInputSchema>;
export type CalculatorOutput = z.infer<typeof calculatorOutputSchema>;
export type TextAnalyzerInput = z.infer<typeof textAnalyzerInputSchema>;
export type TextAnalyzerOutput = z.infer<typeof textAnalyzerOutputSchema>;