// openai.ts
import OpenAI from "openai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateSummaryFromOpenAI = async (pdfText: string, retries = 3): Promise<string> => {
  try {
    const truncatedText = pdfText.substring(0, 15000); // Limit input size
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Transform this document into an engaging summary with emojis and markdown:\n\n${truncatedText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    if (!response.choices[0].message.content) {
      throw new Error("Response content is null");
    }
    return response.choices[0].message.content;
  } catch (error: any) {
    if (error?.status === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000 * (4 - retries)));
      return generateSummaryFromOpenAI(pdfText, retries - 1);
    }
    throw error;
  }
};