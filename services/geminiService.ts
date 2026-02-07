
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initialize GoogleGenAI using a named parameter and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyPrompt(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, poetic, 5-10 word prompt for a photography app that focuses on current mood. No questions, just a calm directive. Example: 'Find a light that feels like home.'",
    });
    // Fix: Access text property directly (not a method) as per guidelines
    return response.text?.trim() || "What does silence feel like right now?";
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return "Capture the essence of your current space.";
  }
}

export async function getMoodInsight(history: { mood: string, date: string }[]): Promise<string> {
  if (history.length === 0) return "Start your journey to see your weekly resonance.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this week's mood history: ${JSON.stringify(history)}. Provide a single sentence (max 15 words) of mature, calm reflection on the user's emotional landscape. Avoid being overly cheerful; aim for resonance.`,
    });
    // Fix: Use the direct .text property from GenerateContentResponse
    return response.text?.trim() || "Your week reflects a steady, grounded rhythm.";
  } catch (error) {
    console.error("Error fetching mood insight:", error);
    return "Your emotions are flowing through a unique season.";
  }
}
