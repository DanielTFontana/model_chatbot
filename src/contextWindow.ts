import type { Message } from "./types.ts";

export class ContextWindow {
  private history: Message[] = [];
  private maxHistoryLength: number;

  constructor(maxHistoryLength: number = 10) {
    this.maxHistoryLength = maxHistoryLength;
  }

  addUserMessage(content: string) {
    const message = {role: "user", content}
    this.history.push(message as Message);
    this.slidingWindow();
    return message
  }

  addAssistantMessage(content: string) {
    const message = {role: "assistant", content}
    this.history.push(message as Message);
    this.slidingWindow();
    // com isso, adiciona a mensagem e já remove a anterior, não precisa ler tudo para depois remover
    return message
  }

  restore(role: Message["role"], content: string) {
    this.history.push({role,content});
  }

  getMessages() {
    return this.history;
  }

  private slidingWindow() {
    const limit = this.maxHistoryLength * 2;
    if (this.history.length > limit) {
      this.history = this.history.slice(-limit);

      // mantém todo registro em memória, mas limita o que é enviado ao modelo
      // return this.history.slice(-limit)
    }
  }
}
