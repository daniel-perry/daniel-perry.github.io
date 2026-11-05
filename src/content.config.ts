import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    year: z.number().int(),
    venue: z.string(),
    type: z.enum(['Conference', 'Workshop', 'Journal', 'Preprint', 'Poster / abstract', 'Thesis / dissertation']),
    topic: z.enum(['Language models & NLP', 'Matrix methods & scientific computing', 'Medical imaging', 'Optimization', 'Computer graphics']),
    url: z.string().url().optional(),
    resources: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).default([]),
    order: z.number().int(),
  }),
});

export const collections = { research };
