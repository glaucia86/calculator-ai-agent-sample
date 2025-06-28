import { z } from 'zod';

export const calculatorInputSchema = z.object({
  a: z.number().describe('First number'),
  b: z.number().describe('Second number'),
});

export const calculatorOutputSchema = z.object({
  result: z.number(),
  operation: z.string(),
  message: z.string(),
  timestamp: z.string().datetime()
});

export const advancedCalculatorInputSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('Operation to perform'),
  a: z.number(),
  b: z.number(),
  precision: z.number().int().min(0).max(10).default(2).optional().describe("Decimal precision")
});

export const advancedCalculatorOutputSchema = z.object({
  result: z.number(),
  operation: z.string(),
  formattedResult: z.string(),
  type: z.string(),
  precision: z.number().optional(),
  timestamp: z.string().datetime()
});

export const textAnalyzerInputSchema = z.object({
  text: z.string().min(1).max(10000).describe("Text to analyze"),
  analysisTypes: z.array(z.enum(['basic', 'sentiment', 'readability', 'keywords'])).default(['basic']).describe("Types of analysis to perform"),
  language: z.enum(['en', 'pt', 'es', 'fr', 'auto']).default('auto').describe("Text language")
});

export const sentimentAnalysisSchema = z.object({
  overall: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number().min(0).max(1),
  positiveWords: z.number().int().min(0),
  negativeWords: z.number().int().min(0)
});

export const textAnalyzerOutputSchema = z.object({
  text: z.string(),
  analysis: z.object({
    characterCount: z.number().int(),
    wordCount: z.number().int(),
    sentenceCount: z.number().int(),
    averageWordsPerSentence: z.number(),
    sentiment: sentimentAnalysisSchema.optional(),
    readabilityScore: z.number().optional(),
    keywords: z.array(z.string()).optional()
  }),
  language: z.string(),
  timestamp: z.string().datetime()
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;
export type CalculatorOutput = z.infer<typeof calculatorOutputSchema>;
export type AdvancedCalculatorInput = z.infer<typeof advancedCalculatorInputSchema>;
export type AdvancedCalculatorOutput = z.infer<typeof advancedCalculatorOutputSchema>;
export type TextAnalyzerInput = z.infer<typeof textAnalyzerInputSchema>;
export type TextAnalyzerOutput = z.infer<typeof textAnalyzerOutputSchema>;