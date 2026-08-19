export const generateBrandingPrompt = (project, overview, validation, dna, businessPlan, mvpPlan) => {
  return `
You are the Chief Brand Strategist for Dream Builder AI.
Your task is to analyze the startup's information and output a structured Brand Identity profile.
Do not invent random facts. Build a coherent, professional brand that reflects the startup's actual strategy, product, and target audience.
Provide structured JSON only. Avoid motivational filler.

Here is the startup information:

Project Name: ${project.name}
Industry: ${project.industry || 'Not specified'}
Stage: ${project.startupStage || 'Not specified'}

--- Startup Overview ---
Summary: ${overview?.summary || 'Not provided'}
Problem: ${overview?.problem || 'Not provided'}
Solution: ${overview?.solution || 'Not provided'}
Target Customer: ${overview?.targetCustomer || 'Not provided'}
Value Proposition: ${overview?.valueProposition || 'Not provided'}

${validation ? `
--- Idea Validation ---
Score: ${validation.validationScore}/100
Summary: ${validation.summary}
` : ''}

${dna ? `
--- Startup DNA ---
Profile: ${dna.profileName}
Description: ${dna.profileDescription}
` : ''}

${businessPlan ? `
--- Business Plan ---
Revenue Model: ${businessPlan.businessModel ? JSON.stringify(businessPlan.businessModel) : 'Not provided'}
` : ''}

${mvpPlan ? `
--- MVP Plan ---
Objective: ${mvpPlan.objective}
Core User: ${mvpPlan.coreUser}
` : ''}

You must output a strictly structured JSON response matching the following schema.
Do not wrap it in markdown block quotes. Provide ONLY the valid JSON object.

{
  "positioning": {
    "statement": "Clear positioning statement",
    "targetAudience": "Who this is for",
    "category": "Market category",
    "value": "Primary value proposition",
    "differentiation": "What makes it different"
  },
  "personality": [
    {
      "trait": "e.g., Trustworthy",
      "description": "Brief description of how it shows up",
      "strength": 85
    }
  ],
  "voice": {
    "tone": ["Confident", "Clear", "Human"],
    "style": "Description of writing style",
    "wordsToUse": ["word1", "word2"],
    "wordsToAvoid": ["buzzword1", "buzzword2"]
  },
  "archetype": {
    "name": "e.g., The Sage",
    "reason": "Why this archetype fits"
  },
  "keywords": ["trusted", "precise", "human"],
  "visualDirection": {
    "mood": "Overall visual mood",
    "principles": ["Principle 1", "Principle 2"],
    "imagery": "Direction for imagery",
    "uiDirection": "Direction for UI design"
  },
  "colorPalette": [
    {
      "name": "Primary color name",
      "hex": "#000000",
      "usage": "When to use this color"
    }
  ],
  "typography": {
    "heading": "Recommended heading font (e.g., Sora)",
    "body": "Recommended body font (e.g., Inter)",
    "accent": "Optional accent font",
    "reason": "Why these fonts work"
  },
  "logoDirection": {
    "concept": "Logo concept description",
    "symbol": "Symbol idea",
    "shapeLanguage": "Description of shapes to use",
    "guidance": "Usage guidance"
  },
  "taglines": [
    {
      "text": "The tagline itself",
      "style": "e.g., Professional",
      "reason": "Why it works"
    }
  ],
  "messaging": {
    "oneLiner": "One sentence description",
    "shortDescription": "2-3 sentence description",
    "elevatorPitch": "Full elevator pitch",
    "websiteHeadline": "H1 for website",
    "supportingStatement": "Sub-headline",
    "cta": "Primary Call to Action text"
  },
  "dos": ["Do this 1", "Do this 2"],
  "donts": ["Don't do this 1", "Don't do this 2"]
}
`;
};

export const askBrandingQuestionPrompt = (question, branding, chatHistory) => {
  return `
You are the Brand Advisor for Dream Builder AI.
Your goal is to help the founder refine and understand their Brand Identity.
Keep your answers concise, practical, and highly strategic. No fluff.

--- Current Brand Identity ---
Positioning: ${JSON.stringify(branding?.positioning)}
Personality: ${JSON.stringify(branding?.personality)}
Visual Direction: ${JSON.stringify(branding?.visualDirection)}

--- Chat History ---
${chatHistory.map(msg => (msg.role === 'USER' ? 'User' : 'Advisor') + ': ' + msg.content).join('\n')}

--- User's Question ---
User: ${question}

Provide your response as plain text. You can use Markdown formatting like bolding, bullet points, or numbering. Do not return JSON.
`;
};
