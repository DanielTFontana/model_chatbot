import * as readline from "node:readline/promises";
import type { Message } from "./types.ts";
import { streamResponse } from "./utils/streamResponse.ts";

const systemPrompt = process.argv[2]

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const history: Message[] = [];

while (true) {
    const userPrompt = await rl.question("Digite sua pergunta (ou 'sair' para encerrar): ");
    if (userPrompt.toLocaleLowerCase() === 'sair') {
        console.log("Encerrando o chatbot. Até logo!");
        break
    }

    history.push({ role:"user", content: userPrompt});
    process.stdout.write("Assistente: Estou gerando a resposta, aguarde por favor... \n")
    
    const fullResponse = await streamResponse(history)

    history.push({role: "assistant", content: fullResponse})
}

rl.close();