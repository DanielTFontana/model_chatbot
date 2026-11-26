import { ContextWindow } from "./contextWindow.ts";
import { MessageRepository } from "./messageRepository.ts";
import type { Message } from "./types.ts";
import { generateWitchCritique } from "./utils/generateWithCritique.ts";
import { summarizeHistory } from "./utils/summarizwHistory.ts";
import * as crypto from "node:crypto";

const windowId = process.argv[2] || crypto.randomUUID();
const contextWindow = new ContextWindow();
const messageRepository = new MessageRepository();

const initialMessages = messageRepository.load(windowId);

initialMessages.forEach((message) => {
  if(initialMessages.length > 0) {
    console.log('RESTAURANDO HISTÓRICO DA SESSAO:', windowId)
  }

  contextWindow.restore(message.role, message.content);
});

const personas = {
  juridico: "você é um especialista em direito brasileiro",
  financeiro: "Você é um especialista em finanças e contabilidade",
  tecnico: "Você é um especialista em tecnologia da informação e IA",
};

const contract = `
  Cláusula 3.1: O contratante poderá rescindir o contrato a qualquer momento, mediante aviso prévio de 30 dias, sem ônus adicional.
  Cláusula 7.2: Multa de 30% do valor total do contrato em aso de rescisão antecipada por parte do contratante.
`;

function contractAnalysisPrompt(params: {
  contractText: string;
  clientType: "pf" | "pj";
  levelOFDetail: "high" | "medium" | "low";
}) {
  return `
  // 1. PAPEL - quem o modelo é (role prompting)
    Você receberá um contrato de um cliente ${params.clientType === "pf" ? "pessoa física" : "pessoa jurídica"}.

  // 2. INSTRUÇÃO - o que fazer
    Analise o texto abaixo e 
    ${
      params.levelOFDetail === "high"
        ? "identifique detalhadamente todas as cláusulas que possam gerar riscos financeiros para empresa contratante, explicando cada uma delas."
        : params.levelOFDetail === "medium"
          ? "identifique as clásulas mais relevantes que possam gerar riscos financeiros para empresa contratante, explicando cada uma delas."
          : "identifique resumidamente as cláusulas mais relevantes que possam gerar riscos financeiros para empresa, explicando-as."
    }

  // 3.DADOS = separados da instrução (separação instruções)
  CONTRATO: ${params.contractText}

  // 4. FORMATO - saída estrutura
  {
    "risks":[
    {
    "clause": "...",
    "risk": "hight|medium|low",
    "explanation": "...",
    },
    ]
  }
  `.trim();
}

async function chatWithPersona(
  persona: keyof typeof personas,
  question: string,
) {
  const systemPrompt = personas[persona];
  const userMessage = contextWindow.addUserMessage(question);
  messageRepository.save(windowId, userMessage as Message);
  const response = await generateWitchCritique(systemPrompt, contextWindow);
  const assistantMessage = contextWindow.addAssistantMessage(response);
  messageRepository.save(windowId, assistantMessage as Message);

  console.log(`\n\n[${persona.toUpperCase()}] resposta: \n`, response);
}

// await chatWithPersona(
//   "juridico",
//   contractAnalysisPrompt({
//     contractText: contract,
//     clientType: "pj",
//     levelOFDetail: "low",
//   }),
// );
console.log("sessão iniciado com id:", windowId);

await chatWithPersona(
  "juridico",
  "só pode escolher um e sem justificar, zico ou maradona?",
);
await chatWithPersona("juridico", "sobre quais jogadores te perguntei?");
await chatWithPersona("juridico", "qual dos jogadores tem mais gols?");

console.log(
  "histórico de mensagens:\n-------------------------------",
  await summarizeHistory(contextWindow),
);

console.log("sessão finalizada com id", windowId);
