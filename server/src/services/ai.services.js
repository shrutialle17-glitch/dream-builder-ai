import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });
};

export const generateText = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured');
    error.statusCode = 500;
    throw error;
  }

  const model = getModel();

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
};

export const fetchFromAIWithRetry = async (prompt, retries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const model = getModel();

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      try {
        return JSON.parse(text);
      } catch {
        const cleanedText = text
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        return JSON.parse(cleanedText);
      }
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
};