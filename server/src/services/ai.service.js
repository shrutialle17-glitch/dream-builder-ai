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
  let text = result.response.text();
  
  // Clean markdown json blocks if present
  text = text.replace(/```json\s?/g, '').replace(/```\s?$/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse AI JSON response:', text);
    throw new Error('Invalid JSON response from AI');
  }
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchFromAIWithRetry = async (prompt, retries = 1, backoff = 2000, timeout = 30000) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use Promise.race to enforce timeout
      const aiPromise = generateJSON(prompt);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timed out')), timeout)
      );
      
      const response = await Promise.race([aiPromise, timeoutPromise]);
      return response;
    } catch (error) {
      console.error(`AI Generation attempt ${attempt + 1} failed:`, error.message);
      if (attempt === retries) {
        throw new Error('AI_GENERATION_FAILED');
      }
      await sleep(backoff);
    }
  }
};
