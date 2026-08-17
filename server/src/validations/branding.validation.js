import { z } from 'zod';

export const brandingGenerationSchema = z.object({
  positioning: z.object({
    statement: z.string(),
    targetAudience: z.string(),
    category: z.string(),
    value: z.string(),
    differentiation: z.string()
  }),
  personality: z.array(z.object({
    trait: z.string(),
    description: z.string(),
    strength: z.number().or(z.string())
  })),
  voice: z.object({
    tone: z.array(z.string()),
    style: z.string(),
    wordsToUse: z.array(z.string()),
    wordsToAvoid: z.array(z.string())
  }),
  archetype: z.object({
    name: z.string(),
    reason: z.string()
  }),
  keywords: z.array(z.string()),
  visualDirection: z.object({
    mood: z.string(),
    principles: z.array(z.string()),
    imagery: z.string(),
    uiDirection: z.string()
  }),
  colorPalette: z.array(z.object({
    name: z.string(),
    hex: z.string(),
    usage: z.string()
  })),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
    accent: z.string().optional(),
    reason: z.string()
  }),
  logoDirection: z.object({
    concept: z.string(),
    symbol: z.string(),
    shapeLanguage: z.string(),
    guidance: z.string()
  }),
  taglines: z.array(z.object({
    text: z.string(),
    style: z.string(),
    reason: z.string()
  })),
  messaging: z.object({
    oneLiner: z.string(),
    shortDescription: z.string(),
    elevatorPitch: z.string(),
    websiteHeadline: z.string(),
    supportingStatement: z.string(),
    cta: z.string()
  }),
  dos: z.array(z.string()),
  donts: z.array(z.string())
});
