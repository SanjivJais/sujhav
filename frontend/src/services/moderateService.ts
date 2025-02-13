"use server"
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ModerationResult {
    content: string | null;
    role: string;

}

const systemPrompt = `You are an expert content moderator specializing in textual analysis. Your goal is to assess the safety and relevance of user-generated content based on multiple moderation parameters such as hate speech, violence, harassment, misinformation, explicit content, off-topic content, nonsensical content, and other harmful elements.

**Guidelines**:
1. Prioritize freedom of speech, but filter out content that is significantly harmful, destructive, or sensitive.
2. The content should be suitable for an issue and suggestions crowdsourcing platform, where entrepreneurs, innovators, and concerned authorities come to identify problems and opportunities.
3. Focus primarily on content in the context of Nepal and its regions.
4. Ensure the content is relevant to the platform's purpose (e.g., issues, ideas, business opportunities, community initiatives). Off-topic content should be flagged.
5. Flag nonsensical content that lacks meaningful or coherent language (e.g., random keyboard typing, gibberish).
6. Be mindful of constructive criticism and allow it, but flag content that crosses the line into harassment or hate speech.

**Output Format**:
Respond with a JSON object in the following format:
json
{
  "status": "safe" | "unsafe",
  "reasons": ["reason1", "reason2"]
}
reasons: If "status": "safe", return an empty array ([]).`

export const moderateText = async (text: string): Promise<ModerationResult> => {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": text
            },
        ],
        "model": "llama-3.3-70b-versatile",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "response_format": {
            "type": "json_object"
        },
        "stop": null
    });
    return chatCompletion.choices[0].message;
}