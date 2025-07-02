# 🤖 Tutorial: AI Agents com Function Calling

## 📚 **O que você vai aprender:**

1. **O que são AI Agents**
2. **Como Function Calling funciona** 
3. **Como criar Tools para Agents**
4. **Como validar com Zod**
5. **Estrutura de projeto simples**

---

## 🧠 **Parte 1: Entendendo AI Agents e Function Calling**

### **🤖 O que é um AI Agent?**

Um AI Agent é um sistema que pode:
- **Conversar** com você naturalmente
- **Usar ferramentas** quando necessário  
- **Tomar decisões** sobre qual ferramenta usar
- **Combinar resultados** para dar uma resposta completa

### **🔧 O que é Function Calling?**

Function Calling permite que o AI:
1. **Reconheça** quando precisa de uma ferramenta
2. **Chame** a ferramenta com os parâmetros corretos
3. **Use** o resultado da ferramenta
4. **Continue** a conversa com a informação

**Exemplo do fluxo:**
```
Você: "Quanto é 15 x 23?"
  ↓
AI: "Preciso calcular isso" → chama calculator(15, 23)
  ↓
Ferramenta: retorna 345
  ↓
AI: "O resultado de 15 x 23 é 345"
```

---

## 📁 **Parte 2: Estrutura de Projeto Simples**

```
ai-agent-tutorial/
├── src/
│   ├── agent.ts          # 🤖 O AI Agent principal
│   ├── tools.ts          # 🔧 Ferramentas (Calculator)
│   ├── schemas.ts        # 📝 Validação Zod
│   └── examples.ts       # 🧪 Exemplos de uso
├── package.json
├── .env
└── README.md
```

---

## 🚀 **Parte 3: Implementação**

### **📝 schemas.ts - Validação com Zod**
```typescript
import { z } from 'zod';

// Schema para validar entrada da calculadora
export const CalculatorInput = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  a: z.number(),
  b: z.number()
});

// Schema para validar saída
export const CalculatorOutput = z.object({
  result: z.number(),
  explanation: z.string()
});

// Type inference automática
export type CalculatorInputType = z.infer<typeof CalculatorInput>;
export type CalculatorOutputType = z.infer<typeof CalculatorOutput>;
```

### **🔧 tools.ts - Ferramentas do Agent**
```typescript
import { CalculatorInput, CalculatorOutput } from './schemas';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Função que executa cálculos
export async function executeCalculator(input: any) {
  // Valida entrada com Zod
  const validated = CalculatorInput.parse(input);
  
  let result: number;
  switch (validated.operation) {
    case 'add':
      result = validated.a + validated.b;
      break;
    case 'subtract':
      result = validated.a - validated.b;
      break;
    case 'multiply':
      result = validated.a * validated.b;
      break;
    case 'divide':
      if (validated.b === 0) throw new Error('Cannot divide by zero');
      result = validated.a / validated.b;
      break;
  }
  
  // Retorna com validação
  return CalculatorOutput.parse({
    result,
    explanation: `${validated.a} ${validated.operation} ${validated.b} = ${result}`
  });
}

// Definição da tool para o AI
export const calculatorTool = {
  type: "function" as const,
  function: {
    name: "calculator",
    description: "Performs basic arithmetic operations",
    parameters: zodToJsonSchema(CalculatorInput)
  }
};
```

### **🤖 agent.ts - AI Agent Principal**
```typescript
import { OpenAI } from 'openai';
import { calculatorTool, executeCalculator } from './tools';

// Configurar cliente OpenAI
const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export async function runAgent(userMessage: string) {
  console.log(`👤 User: ${userMessage}`);
  
  // Primeira chamada - AI decide se precisa de tools
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant with access to a calculator tool."
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    tools: [calculatorTool],
    tool_choice: "auto"
  });

  const message = response.choices[0].message;
  
  // Se AI não pediu tools, retorna resposta direta
  if (!message.tool_calls) {
    console.log(`🤖 Assistant: ${message.content}`);
    return message.content;
  }

  // AI pediu para usar tools
  console.log(`🔧 Using tools...`);
  
  // Executar cada tool solicitada
  const toolResults = [];
  for (const toolCall of message.tool_calls) {
    console.log(`  → Calling ${toolCall.function.name}`);
    
    if (toolCall.function.name === "calculator") {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeCalculator(args);
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: "tool" as const,
          content: JSON.stringify(result)
        });
      } catch (error) {
        toolResults.push({
          tool_call_id: toolCall.id,
          role: "tool" as const,
          content: `Error: ${error.message}`
        });
      }
    }
  }

  // Segunda chamada - AI usa resultados das tools
  const finalResponse = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant with access to a calculator tool."
      },
      {
        role: "user",
        content: userMessage
      },
      message,
      ...toolResults
    ]
  });

  const finalMessage = finalResponse.choices[0].message.content;
  console.log(`🤖 Assistant: ${finalMessage}`);
  return finalMessage;
}
```

### **🧪 examples.ts - Exemplos de Uso**
```typescript
import { runAgent } from './agent';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log("🚀 AI Agent Calculator Demo\n");
  
  // Exemplos de perguntas
  const questions = [
    "Quanto é 15 x 23?",
    "Me ajude a calcular: 1000 dividido por 25",
    "Qual a soma de 456 e 789?",
    "Olá, como você está?",
    "Preciso subtrair 100 de 250, pode me ajudar?"
  ];

  for (const question of questions) {
    console.log("─".repeat(50));
    await runAgent(question);
    console.log();
  }
}

main().catch(console.error);
```

---

## 🚀 **Parte 4: Como Usar**

### **1. Configurar projeto:**
```bash
mkdir calculator-ai-agent-sample
cd calculator-ai-agent-sample
npm init -y
npm install openai zod dotenv zod-to-json-schema
npm install -D typescript tsx @types/node
```

### **2. Criar arquivos:**
- Copie cada código acima no arquivo correspondente
- Crie `.env` com: `GITHUB_TOKEN=seu_token`

### **3. Configurar TypeScript:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

### **4. Executar:**
```bash
npx tsx src/examples.ts
```

---

## 🔍 **Parte 5: Entendendo o Fluxo do AI Agent**

### **📋 Passo a Passo do que acontece:**

1. **Você pergunta:** "Quanto é 15 x 23?"

2. **AI analisa** e pensa: "Preciso calcular isso"

3. **AI gera Function Call:**
   ```json
   {
     "function": "calculator",
     "arguments": {"operation": "multiply", "a": 15, "b": 23}
   }
   ```

4. **Nosso código executa** a calculadora com esses argumentos

5. **Calculadora retorna:**
   ```json
   {
     "result": 345,
     "explanation": "15 multiply 23 = 345"
   }
   ```

6. **AI recebe resultado** e formula resposta final

7. **AI responde:** "O resultado de 15 x 23 é 345"

### **🎯 Por que isso é poderoso?**

- **AI decide quando usar tools** (não você!)
- **AI escolhe os parâmetros corretos**
- **Zod garante que dados estão corretos**
- **Você pode adicionar quantas tools quiser**

---

## 🔧 **Parte 6: Adicionando Novas Tools**

Para adicionar uma nova tool (ex: conversor de moeda):

### **1. Adicionar schema em schemas.ts:**
```typescript
export const CurrencyInput = z.object({
  amount: z.number(),
  from: z.string(),
  to: z.string()
});
```

### **2. Adicionar tool em tools.ts:**
```typescript
export async function executeCurrency(input: any) {
  // Lógica de conversão
  const validated = CurrencyInput.parse(input);
  // ... implementar conversão
  return result;
}

export const currencyTool = {
  type: "function" as const,
  function: {
    name: "currency_converter",
    description: "Converte valores entre moedas",
    parameters: zodToJsonSchema(CurrencyInput)
  }
};
```

### **3. Adicionar no agent.ts:**
```typescript
tools: [calculatorTool, currencyTool]  // ← Adicionar aqui
```

### **4. Tratar no agent.ts:**
```typescript
if (toolCall.function.name === "currency_converter") {
  const result = await executeCurrency(args);
  // ...
}
```

---

## 🎯 **Parte 7: Principais Conceitos dos AI Agents**

### **🧠 Autonomia:**
- AI **decide** quando usar tools
- AI **escolhe** qual tool usar
- AI **formula** os parâmetros

### **🔧 Orquestração:**
- AI pode usar **múltiplas tools** em sequência
- AI pode **combinar resultados**
- AI **gerencia** toda a conversa

### **🛡️ Validação:**
- **Zod valida** entrada e saída
- **Tratamento de erros** automático
- **Type safety** garantida

### **📈 Escalabilidade:**
- **Fácil adicionar** novas tools
- **Cada tool** é independente
- **Agent orquestra** tudo automaticamente

---

## ✅ **Resumo: O que você aprendeu**

1. ✅ **AI Agents** são sistemas que usam tools autonomamente
2. ✅ **Function Calling** permite AI chamar funções específicas  
3. ✅ **Zod** garante validação de dados
4. ✅ **GitHub Models** oferece modelos com function calling
5. ✅ **Estrutura simples** mas escalável
6. ✅ **Como adicionar** novas tools facilmente

## 🚀 **Próximos Passos**

- Adicionar tool de **busca web**
- Criar tool de **análise de texto**
- Implementar **memória** do agent
- Adicionar **interface web**

## 📖 **Recursos Adicionais**

- [OpenAI Function Calling Documentation](https://platform.openai.com/docs/guides/function-calling)
- [Zod Documentation](https://zod.dev/)
- [GitHub Models](https://github.com/marketplace/models)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Agora você sabe como criar AI Agents reais!** 🎉