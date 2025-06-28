import { z } from 'zod';
import { OpenAI } from 'openai';
import { env } from '../config/environment'
import { logger } from '../utils/logger';
import { defaultModel } from '../config/models';

const clientConfigSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(8000).optional(),
  timeout: z.number().min(1000).optional(),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;

export class GitHubModelsClient {
  private client: OpenAI;
  private config: Required<ClientConfig>;
  private endpoint = "https://models.github.ai/inference";

  constructor(config: ClientConfig = {}) {
    // Validate configuration
    const validatedConfig = clientConfigSchema.parse(config);
    
    this.config = {
      model: validatedConfig.model || defaultModel.id,
      temperature: validatedConfig.temperature || env.AI_TEMPERATURE,
      maxTokens: validatedConfig.maxTokens || env.AI_MAX_TOKENS,
      timeout: validatedConfig.timeout || env.AI_TIMEOUT_MS
    };

    this.client = new OpenAI({
      baseURL: this.endpoint,
      apiKey: env.GITHUB_TOKEN,
      timeout: this.config.timeout
    });

    logger.info('GitHub Models client initialized', {
      endpoint: this.endpoint,
      model: this.config.model,
      temperature: this.config.temperature
    });
  }

  async createChatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    options: Partial<ClientConfig & { tools?: any[]; toolChoice?: string }> = {}
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const startTime = Date.now();
    
    try {
      const model = options.model || this.config.model;

      logger.debug('Creating chat completion', {
        messageCount: messages.length,
        model,
        hasTools: !!options.tools?.length
      });

      const response = await this.client.chat.completions.create({
        model: model as string,
        messages,
        temperature: options.temperature ?? this.config.temperature,
        max_completion_tokens: options.maxTokens ?? this.config.maxTokens,
        tools: options.tools,
        tool_choice: options.tools?.length ? 'auto' : undefined,
        stream: false
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming);

      const duration = Date.now() - startTime;
      
      logger.info('Chat completion successful', {
        duration,
        tokensUsed: response.usage?.total_tokens,
        finishReason: response.choices[0]?.finish_reason
      });

      return response;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('Chat completion failed', {
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  getConfig(): Readonly<ClientConfig> {
    return { ...this.config };
  }
}