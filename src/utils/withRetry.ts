import OpenAI, { OpenAIError } from "openai";

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayInSeconds: number = 1,
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
        const isRetryable = 
        error instanceof OpenAI.RateLimitError ||
        // erro quando mandamos muita requisição em um curto período de tempo
        error instanceof OpenAI.APIConnectionError ||
        error instanceof OpenAI.APIConnectionTimeoutError ||
        error instanceof OpenAI.APIError &&

        (error.status === 429 || error.status >= 500)

        if(!isRetryable || attempt === retries){
            throw error;
        } 

        const exponentialDelay = Math.pow(2, attempt) * (delayInSeconds * 1000)
        console.warn(`Attemp ${attempt} failed. Retrying in ${delayInSeconds}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayInSeconds));
      
    }
  }

  throw new Error("This should never be reached");
}
