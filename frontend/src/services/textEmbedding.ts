"use server";
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const getEmbedding = async (text: string) => {
  try {
    const embed = await cohere.v2.embed({
      texts: [text],
      model: "embed-english-v3.0",
      inputType: "classification",
      embeddingTypes: ["float"],
    });

    return embed.embeddings ?? null;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};
