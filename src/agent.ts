import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { calculatorTool, executeCalculator } from './tools';

dotenv.config();

// Configuração simples
const client = new OpenAI({
  baseURL: 'https://models.github.ai/inference',
  apiKey: process.env.OPEN_API_GITHUB_MODEL_TOKEN
});

export class AICalculatorAgent {
  async chat(userMessage: string): Promise<string> {
    console.log(`\n 👤 Você...: ${userMessage}`);

    // 1. Preparar a conversa
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role:'system',
        content: 'Você é um agente de IA especializado em cálculos matemáticos. Você pode realizar operações básicas como adição, subtração, multiplicação e divisão. Sempre forneça uma explicação clara do resultado. Entre elas alguns calculos extraordinários, como calcular a raiz quadrada de um número, calcular o fatorial de um número, calcular a potência de um número, calcular o logaritmo de um número, calcular a média de uma lista de números, calcular a mediana de uma lista de números, calcular a moda de uma lista de números, calcular o desvio padrão de uma lista de números, calcular a porcentagem de um número em relação a outro número e converter unidades (por exemplo, metros para quilômetros).',
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    // 2. Chamar a AO com as tools disponíveis
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o',
      messages,
      tools: [calculatorTool], // Aqui está o Function Calling;
      tool_choice: 'auto' // A AI decidirá quando usar tools
    });

    const message = response.choices[0].message;

    // 3. Verificar se a AI quer usar alguma tool
    if (message.tool_calls) {
      console.log("🔧 A AI quer usar uma ferramenta...");

      messages.push({
        role: 'assistant',
        content: message.content,
        tool_calls: message.tool_calls
      });

      // 4. Executar cada tool que a AI pediu
      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === 'calculator') {
          try {
            // Pegar argumentos que a AI enviou]
            const args = JSON.parse(toolCall.function.arguments);
            console.log(`📥 AI enviou:`, args);

            // Executar a nossa calculadora:
            const result = await executeCalculator(args);
            console.log(`📤 Resultado da calculadora:`, result);

            // Enviar o rsultado de volta para a AI
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            });
          } catch (error) {
            console.log(`❌ Erro ao executar a ferramenta:`, error);
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: 'Erro ao executar a ferramenta.' })
            });
          }
        }
      }

      // 5. Pedir resposta final da AI
      const finalResponse = await client.chat.completions.create({
        model: 'openai/gpt-4o',
        messages,
      });

      return finalResponse.choices[0].message.content || 'Desculpe, não consegui entender a resposta da AI.';
    }

    return message.content || 'Desculpe, não consegui entender a resposta da AI.';
  }
}