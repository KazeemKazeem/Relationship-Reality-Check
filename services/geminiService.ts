
import { GoogleGenAI } from "@google/genai";
import { EvaluationResult } from "../types.ts";

export const generateNeutralAdvice = async (result: EvaluationResult): Promise<string> => {
  // Check if API key exists to avoid initialization errors
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API key is missing. Using fallback advice.");
    return "Focus on areas with lower scores and consider open dialogue as a first step toward understanding. Each connection is unique and requires ongoing patience and effort.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
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

  const promptText = `
    Relationship Context: ${result.relationshipCategory} connection labeled "${result.relationshipLabel}".
    ${contextStrings.length > 0 ? `Specific Details: ${contextStrings.join(', ')}` : ''}
    Evaluation Summary:
    - Total Score: ${result.totalScore}%
    - Detailed Breakdown: ${categoryBreakdownText}
    
    Task: Provide exactly 3 short, neutral, and reflective bullet points of advice. 
    Guidelines: 
    - Be supportive but objective.
    - Avoid psychological labels or definitive diagnoses.
    - Focus on communication, boundaries, and mutual respect.
    - Tailor advice to the relationship duration and closeness level if provided.
    - Total word count should be under 120 words.
    - Return ONLY the bullet points, no introductory text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
    });
    
    const output = response.text;
    if (output && output.trim().length > 0) {
      return output.trim();
    }
    
    throw new Error("Empty response from AI model");
  } catch (error) {
    console.error("Error generating advice:", error);
    return "• Reflect on areas with lower scores to identify patterns in communication.\n• Consider if boundaries are being mutually respected and adjusted as the relationship evolves.\n• Open, honest dialogue remains the most effective tool for deepening understanding and trust.";
  }
};
