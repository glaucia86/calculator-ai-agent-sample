import { CalculatorInput, CalculatorInputType, CalculatorOutput, CalculatorOutputType, zodToOpenAI } from "./schemas";

export async function executeCalculator(input: CalculatorInputType): Promise<CalculatorOutputType> {
  console.log(`🔢 Calculando...: ${input.a} ${input.operation} ${input.b}`);

  //Validar entrada com Zod
  const validated = CalculatorInput.parse(input);

  let result: number;

  //Realizar as operações matemáticas
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
      if (validated.b === 0) {
        throw new Error("Divisão por zero não é permitida.");
      }
      result = validated.a / validated.b;
      break;
  }

  //Validar a saída com Zod
  return CalculatorOutput.parse({
    result,
    explanation: `A operação ${validated.a} ${validated.operation} ${validated.b} resultou em ${result}.`
  });
}

// Definição da tool para o AI Agent
export const calculatorTool = {
  type: "function" as const,
  function: {
    name: "calculator",
    description: "Realiza operações matemáticas básicas.",
    parameters: zodToOpenAI(CalculatorInput)
  }
};