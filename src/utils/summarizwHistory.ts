import { openai } from "../clients/openai.ts";
import { ContextWindow } from "../contextWindow.ts";
import { generateWitchCritique } from "./generateWithCritique.ts";

export async function summarizeHistory(
  contextWindow: ContextWindow,
): Promise<string> {
  const systemPrompt = `Você [e um assistente especializado em resumir conversas.
    Analise o histórico de mensagens e forneça um resumo conciso, destacando os principais
    tópicos discutidos, perguntas feitas e respostas fornecidas.
    Mantenha o resumo em linguagem acessível e clara.
    Limite o resumo à um único parágrafo, evitando detalhes excessivos, mas garantindo que os pontos principas sejam capturados.
    `;

  const response = await openai.chat.completions.create({
    model: "gpt-6.1-sol",
    messages: [
      { role: "system", content: systemPrompt },
      ...contextWindow.getMessages(),
    ],
  });
  return response.choices[0].message?.content ?? "";
}
