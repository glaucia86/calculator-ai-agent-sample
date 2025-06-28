# AI Agents com GitHub Models, Zod e TypeScript

Este projeto demonstra como criar AI Agents robustos usando:

- **GitHub Models** para acesso a LLMs via OpenAI SDK
- **Zod** para validação de schemas e type safety
- **TypeScript** com arquitetura organizada em pastas
- **Function Calling** para integração de tools
- **Logging estruturado** e tratamento de erros

## 🚀 Quick Start

```bash
# 1. Clone e setup
git clone <this-repo>
cd ai-agents-zod
./setup.sh

# 2. Configure environment
# Edit .env with your GITHUB_TOKEN

# 3. Run examples
npm run examples:all
```

## 📁 Estrutura do Projeto

```
src/
├── config/          # Configuração de ambiente e modelos
├── types/           # Schemas Zod e definições de tipos
├── core/            # Cliente OpenAI e classe Agent principal
├── tools/           # Implementação de tools com validação Zod
├── utils/           # Utilitários (logger, validação)
├── examples/        # Exemplos de uso
└── index.ts         # Entry point
```

## 🛠 Principais Features

### Type Safety com Zod

Todos os inputs e outputs são validados em runtime:

```typescript
const calculatorInput = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number")
});

// Validação automática
const result = await calculator.execute(userInput);
```

### Tools com Validação

```typescript
class CalculatorTool {
  static getDefinition(): FunctionTool {
    return {
      type: 'function',
      function: {
        name: 'calculator',
        description: 'Multiply two numbers',
        parameters: zodToOpenAIParams(calculatorInputSchema)
      }
    };
  }

  static async execute(args: unknown): Promise<CalculatorOutput> {
    const input = validateSchema(calculatorInputSchema, args);
    // ... implementação
  }
}
```

### Agent com Logging Estruturado

```typescript
const agent = new AIAgent();

const result = await agent.generate({
  system: "You are a helpful assistant",
  prompt: "Calculate 15 × 23",
  tools: [CalculatorTool.getDefinition()],
  maxSteps: 5
});
```

## 📚 Examples

### Basic Calculator

```bash
npm run examples:basic
```

### Multi-Tool Usage

```bash
npm run examples:advanced
```

### All Examples

```bash
npm run examples:all
```

## 🔧 Available Tools

- **Calculator**: Multiplicação básica
- **Advanced Calculator**: Operações matemáticas completas
- **Text Analyzer**: Análise de sentimento e métricas de texto

## 🎯 Modelos Suportados

- OpenAI GPT-4o / GPT-4o Mini
- Anthropic Claude 3.5 Sonnet  
- Meta Llama 3.1 405B
- xAI Grok Beta

## 📝 Development

```bash
# Development mode
npm run dev

# Build
npm run build

# Tests
npm test

# Lint
npm run lint
```

## 🔒 Environment Variables

```env
GITHUB_TOKEN=your_github_models_token_here
NODE_ENV=development
LOG_LEVEL=info
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
```

## 📄 License

MIT License - see LICENSE file for details.
