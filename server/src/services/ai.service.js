import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

export const generateText = async (prompt, options = {}) => {
  const client = getGenAI();
  const model = client.getGenerativeModel({ model: options.model || 'gemini-3.1-flash-lite' });
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateJSON = async (prompt, schema, options = {}) => {
  const client = getGenAI();
  
  const generationConfig = {
    responseMimeType: 'application/json',
  };
  
  if (schema) {
    generationConfig.responseSchema = schema;
  }
  
  const model = client.getGenerativeModel({ 
    model: options.model || 'gemini-3.1-flash-lite',
    generationConfig
  });
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse AI JSON response:', text);
    throw new Error('Invalid JSON response from AI');
  }
};
