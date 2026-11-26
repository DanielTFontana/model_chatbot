import type { Message } from "../types.ts";
import {openai} from "../clients/openai.ts"

export async function streamResponse(history: Message[], system = "Você é um assistete útil e prestativo" ){
    let fullResponse = "";

    const stream = await openai.chat.completions.create({
        model: "gpt-6-luna",
        messages: [
            {role: "system", content: system },
            ...history,
        ],
        stream: true,
    });

    for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;

        if (delta) {
            process.stdout.write(delta);
            fullResponse += delta;
        }

    }

    return fullResponse
}