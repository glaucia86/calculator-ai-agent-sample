import { AICalculatorAgent } from "./agent";

async function testarAIAgentCalculator() {
  console.log("🔍 Testando o AI Agent de Cálculos...");

  const agent = new AICalculatorAgent();

  // Teste 1: Calculo Simples
  console.log("=== 🧪 Teste 1: Multiplicação ===");
  const resultado1 = await agent.chat("Quanto é 15 vezes 23?");
  console.log(`🤖 AI...: ${resultado1}\n`);

  // Teste 2: Problema mais complexo
  console.log("=== 🧪 Teste 2: Problema Complexo ===");
  const resultado2 = await agent.chat("Se eu tenho 100 reais e compro 3 camisetas que custam 25 reais cada, quanto eu tenho agora?");
  console.log(`🤖 AI...: ${resultado2}\n`);

  // Teste 3 : Divisão com zero
  console.log("=== 🧪 Teste 3: Divisão por Zero ===");
  const resultado3 = await agent.chat("Quanto é 15 dividido por 0?");
  console.log(`🤖 AI...: ${resultado3}\n`);

  console.log("✅ Todos os testes foram executados com sucesso!");
}

if (require.main === module) {
  testarAIAgentCalculator().catch(console.error);
}

export { testarAIAgentCalculator };