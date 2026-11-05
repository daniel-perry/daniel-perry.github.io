import { z } from 'astro:content';

const experienceSchema = z.array(z.object({
  employer: z.string(),
  title: z.string(),
  dates: z.string(),
  summary: z.string(),
}));

export const experience = experienceSchema.parse([
  {
    employer: 'Microsoft',
    title: 'Principal Applied Scientist',
    dates: 'December 2025 – present',
    summary: 'AI-agent evaluation, conversation analysis, and end-to-end agent quality.',
  },
  {
    employer: 'Qualtrics',
    title: 'Staff ML Applied Scientist',
    dates: 'April 2021 – December 2025',
    summary: 'Production NLP, efficient multilingual models, and LLM adaptation, with technical leadership and scientist mentoring.',
  },
  {
    employer: 'Amazon · Alexa AI',
    title: 'ML Applied Scientist',
    dates: 'May 2018 – April 2021',
    summary: 'Knowledge distillation, compressed language models, architecture search, and speech-model research.',
  },
]);

export const links = {
  github: 'https://github.com/daniel-perry',
  linkedin: 'https://www.linkedin.com/in/dannyperry',
  scholar: 'https://scholar.google.com/citations?user=uva2_4wAAAAJ&hl=en',
};
