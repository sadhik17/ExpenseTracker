
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, AIInsight } from "../types";

export const analyzeSpending = async (expenses: Expense[]): Promise<AIInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const expenseData = expenses.map(e => ({
    amount: e.amount,
    category: e.category,
    description: e.description
  }));

  const prompt = `Analyze these daily expenses (in Indian Rupees - INR) and provide a JSON response: ${JSON.stringify(expenseData)}. 
  Evaluate the spending habits in the context of an Indian user. Suggest 2 actionable saving tips relevant to the Indian lifestyle. 
  Assign a sentiment of 'frugal' (spent very little/essential), 'balanced' (normal spending), or 'extravagant' (many luxury/non-essential items).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'A short summary of today\'s spending.' },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'List of 2 saving tips.'
            },
            sentiment: { 
              type: Type.STRING, 
              enum: ['frugal', 'balanced', 'extravagant'] 
            }
          },
          required: ['summary', 'tips', 'sentiment']
        }
      }
    });

    return JSON.parse(response.text || '{}') as AIInsight;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "I couldn't analyze your spending right now, but keeping track in Rupees is the first step to success!",
      tips: ["Try setting a daily limit in INR.", "Always review your non-essential purchases."],
      sentiment: "balanced"
    };
  }
};
