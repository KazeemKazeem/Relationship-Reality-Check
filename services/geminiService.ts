
import { GoogleGenAI } from "@google/genai";
import { EvaluationResult } from "../types";

export const generateNeutralAdvice = async (result: EvaluationResult): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryBreakdownText = result.categoryBreakdown
    .map(c => `${c.name}: ${c.score}%`)
    .join(', ');

  const meta = result.metadata;
  const contextStrings = [];
  if (meta) {
    contextStrings.push(`Subtype: ${meta.subtype}`);
    contextStrings.push(`Duration: ${meta.durationMonths} months`);
    contextStrings.push(`Closeness: ${meta.closenessLevel}/10`);
    contextStrings.push(`Living Situation: ${meta.livingSituation}`);
  }

  const prompt = `
    Context: A user just completed a relationship evaluation for a ${result.relationshipCategory} relationship labeled "${result.relationshipLabel}".
    ${contextStrings.length > 0 ? `Relationship Details: ${contextStrings.join(', ')}` : ''}
    Total Score: ${result.totalScore}%
    Breakdown: ${categoryBreakdownText}
    
    Task: Provide 3 short, neutral, and reflective bullet points of advice based on these scores and the relationship context. 
    Guidelines: 
    - Be supportive but neutral.
    - Do not make psychological claims or diagnoses.
    - Focus on communication, boundaries, and mutual respect.
    - Consider the duration and living situation if provided (e.g., long-term vs new connection).
    - Keep it under 150 words.
    - Return ONLY the bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Continue focusing on open communication and mutual respect.";
  } catch (error) {
    console.error("Error generating advice:", error);
    return "Reflect on areas with lower scores and consider open dialogue as a first step toward understanding.";
  }
};
