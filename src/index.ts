import { openai } from "./clients/openai.ts";
import { generateWitchCritique } from "./utils/generateWithCritique.ts";
import { withRetry } from "./utils/withRetry.ts";

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
  const response = await generateWitchCritique(systemPrompt, question);
  console.log(`\n\n[${persona.toUpperCase()}] resposta: \n`, response)
  
  };

  // for await (const chunk of response) {
  //   const content = chunk.choices[0]?.delta?.content ?? "";
  //   if (content.length > 0) {
  //     process.stdout.write(content);
  //   }
  // }


await chatWithPersona(
  "juridico",
  contractAnalysisPrompt({
    contractText: contract,
    clientType: "pj",
    levelOFDetail: "low",
  }),
);
