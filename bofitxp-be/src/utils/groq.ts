import Groq from "groq-sdk";

export const getGroqClient = (): Groq | null => {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return new Groq({ apiKey });
};

export const ensureGroqClient = (): Groq => {
  const client = getGroqClient();

  if (!client) {
    throw new Error(
      "GROQ_API_KEY is not configured. Set it in the server environment before generating AI quests.",
    );
  }

  return client;
};

export default getGroqClient;
