import { z } from 'zod';

export const pitchDeckGenerationSchema = z.object({
  title: z.string(),
  slides: z.array(z.object({
    slideNumber: z.number().or(z.string()),
    slideType: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    keyMessage: z.string(),
    content: z.array(z.string()),
    visualType: z.string(),
    visualData: z.any().optional(),
    speakerNotes: z.string()
  })),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string()
  }).optional()
});
