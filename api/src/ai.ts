import { GoogleGenAI } from '@google/genai';

export async function askAi(stats: any, question: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a helpful, expert AI analytics assistant for LiteTrack.
You are given the live JSON data of the user's website analytics for a specific time period.
Answer their question accurately and concisely based ONLY on this JSON data. 
Format your answer in plain text or simple markdown. Do not include a code block or the raw JSON data itself in the response.
Be conversational but professional.

Here is the analytics data:
${JSON.stringify(stats)}

Question: ${question}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || 'Sorry, I could not generate an answer.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Sorry, I encountered an error while trying to answer your question.';
  }
}
