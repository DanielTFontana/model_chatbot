import { openai } from "../clients/openai.ts"
import { ContextWindow } from "../contextWindow.ts";
import { withRetry } from "./withRetry.ts"

// ideia importante para auto-validação por dentro do sistema e entregará já resposta mais acertiva

export async function generateWitchCritique(
    system:string,
    contextWindow: ContextWindow,
): Promise<string>{
// Step 1: Generate initial response
    const draft = await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-6.1-sol",
            messages: [
                {role: "system", content: system},
                ...contextWindow.getMessages(),
            ],
        });
        return response.choices[0].message?.content ?? "";
    })


// Step2 2: Generate critique
const critique = await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: "gpt-6.1-sol",
            messages: [
                {role: "system", content: `Identifique em uma frase pontos de melhoria na resposta. se a resposta tem imprecisões ou pode melhorar. Se estiver boa diga "approved", se não diga o que pode/deve ser melhorado`},
                {role:"user", content: draft}
            ]
        });
        return response.choices[0].message?.content ?? "";
    })

// Step 3: Generate final response based on critique
if (critique.toLocaleLowerCase() === "approved"){
    return draft
}

    return await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model:"gpt-6-luna",
            messages: [
                {role: "system", content: `Reescreva a respota anterior considerando a crítica e/ou melhorias recebidas.`},
                {role:"user", content: `Resposta anterior: ${draft}\n\nCrítica: ${critique}`}
            ],
        });

        return response.choices[0].message?.content ?? ""
    })
}
