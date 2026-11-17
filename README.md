# Chatbot and contract analysis with OpenAI

[English](#chatbot-and-contract-analysis-with-openai) · [Português](#chatbot-e-análise-de-contratos-com-openai)

This TypeScript learning project includes two examples of using the OpenAI API. The first is an interactive terminal chatbot. The second analyzes financial risks in a sample contract and uses a review step to improve the response.

## Getting started

You need Node.js 24, npm, and an OpenAI API key. From the project root, run the following commands in PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
```

If you already have a `.env.local` file, skip the copy command. Open the file and set `OPENAI_API_KEY` to your key. Git ignores `.env.local`, and `.env.example` provides a template for anyone who clones the project.

## Terminal chatbot

```powershell
node --env-file=.env.local src/chatbot.ts
```

Type a question and press Enter. The response streams to the terminal as the model generates it. The chatbot uses earlier messages as context during the session. Type `sair` to exit.

## Contract analysis

```powershell
node --env-file=.env.local src/index.ts
```

The example uses the legal persona to identify financial risks in two clauses defined in the code. The model generates an initial response, then reviews it in a second API call. If the review suggests improvements, a third call rewrites the response. The result appears in the terminal.

Both examples call the API to generate responses. Your API key needs access to the models configured in the code.

## Project structure

| File | Purpose |
| --- | --- |
| `src/chatbot.ts` | Reads questions from the terminal and keeps the session history. |
| `src/index.ts` | Defines the personas, sample clauses, and analysis prompt. |
| `src/clients/openai.ts` | Configures the OpenAI client using `OPENAI_API_KEY`. |
| `src/utils/streamResponse.ts` | Displays the chatbot response as it arrives. |
| `src/utils/generateWithCritique.ts` | Generates, reviews, and rewrites the analysis when needed. |
| `src/utils/withRetry.ts` | Retries analysis requests after temporary failures. |
| `src/types.ts` | Defines the type for messages in the conversation history. |

---

# Chatbot e análise de contratos com OpenAI

Projeto de estudo em TypeScript com dois exemplos de uso da API da OpenAI. O primeiro é um chatbot interativo no terminal. O segundo analisa riscos financeiros em cláusulas de um contrato de exemplo e usa uma etapa de revisão para melhorar a resposta.

## Como começar

Você precisa do Node.js 24, do npm e de uma chave de API da OpenAI. Na raiz do projeto, execute no PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
```

Se você já tem um `.env.local`, pule a cópia. Abra o arquivo e preencha `OPENAI_API_KEY` com sua chave. O Git ignora `.env.local`, enquanto `.env.example` serve como modelo para quem clonar o projeto.

## Chatbot no terminal

```powershell
node --env-file=.env.local src/chatbot.ts
```

Digite uma pergunta e pressione Enter. A resposta aparece no terminal à medida que é gerada. O chatbot usa as mensagens anteriores como contexto durante a sessão. Digite `sair` para encerrar.

## Análise de contrato

```powershell
node --env-file=.env.local src/index.ts
```

O exemplo usa a persona jurídica para identificar riscos financeiros em duas cláusulas definidas no código. O modelo gera uma resposta inicial e, em uma segunda chamada, avalia se ela precisa de ajustes. Se a avaliação apontar melhorias, uma terceira chamada reescreve a resposta. O resultado aparece no terminal.

Os dois exemplos fazem chamadas à API quando geram respostas. A chave precisa ter acesso aos modelos configurados no código.

## Estrutura do projeto

| Arquivo | Função |
| --- | --- |
| `src/chatbot.ts` | Lê perguntas do terminal e mantém o histórico da sessão. |
| `src/index.ts` | Define as personas, as cláusulas de exemplo e o prompt de análise. |
| `src/clients/openai.ts` | Configura o cliente da OpenAI com a variável `OPENAI_API_KEY`. |
| `src/utils/streamResponse.ts` | Exibe a resposta do chatbot à medida que ela chega. |
| `src/utils/generateWithCritique.ts` | Gera, avalia e, se necessário, reescreve a análise. |
| `src/utils/withRetry.ts` | Repete chamadas da análise em caso de falhas temporárias. |
| `src/types.ts` | Define o tipo das mensagens do histórico. |
