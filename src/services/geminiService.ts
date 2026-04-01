import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getFootRecommendation = async (quizResults: any, answers: Record<number, string>, journalEntries?: any[]) => {
  const prompt = `
    Based on the following comprehensive foot health assessment, provide a personalized, intent-driven recommendation.
    
    Quiz Scores: ${JSON.stringify(quizResults)}
    Detailed Answers: ${JSON.stringify(answers)}
    ${journalEntries && journalEntries.length > 0 ? `Recent Journal Entries: ${JSON.stringify(journalEntries)}` : ''}
    
    The user is looking for specific solutions. Use Google Search to find:
    1. The latest non-invasive treatments for the identified symptoms.
    2. Highly-rated foot care products available in their region (assume India/Global if not specified).
    3. Specific exercises or lifestyle changes backed by recent podiatry research.

    Please provide the response in a structured, professional format:
    - **AI Analysis**: A deep dive into what their symptoms suggest, connecting the dots between their activity level, footwear, and pain points.
    - **Actionable Plan**: 4-5 specific steps they can take today.
    - **Recommended Solutions**: Specific product types and why they fit the user's "intent" (e.g., if they are a runner, focus on athletic recovery).
    - **Professional Guidance**: When to see a doctor and what specific questions to ask them.

    Disclaimer: This is an AI-generated analysis for educational purposes and not medical advice.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a world-class podiatrist assistant. Your goal is to provide highly personalized, data-driven foot health advice. Use your search tool to ensure recommendations are current and relevant to the user's specific lifestyle and symptoms.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getJournalInsight = async (entries: any[]) => {
  const prompt = `
    Analyze these foot health journal entries and provide a brief, intent-driven insight.
    Entries: ${JSON.stringify(entries)}
    
    Use Google Search to cross-reference these symptoms with common triggers or seasonal factors (e.g., weather changes affecting joint pain).
    
    Focus on:
    - **Trend Detection**: Is the pain correlating with specific activities or days?
    - **Intent Analysis**: What is the user trying to achieve (e.g., recovery, maintenance, performance)?
    - **Proactive Tip**: One specific thing they can do tomorrow based on their recent data.
    
    Keep it concise, encouraging, and data-backed.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a supportive health coach and data analyst. Analyze trends in the user's foot health journal and provide encouraging, search-grounded insights.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
