
'use server';
/**
 * @fileOverview A flow to generate a daily reflection.
 *
 * - getDailyReflection - A function that returns a short, calming reflection.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyReflectionOutputSchema = z.string().describe("A short, calming haiku or Taoist reflection about focus, stillness, or single-tasking.");

const prompt = ai.definePrompt({
  name: 'dailyReflectionPrompt',
  output: {schema: DailyReflectionOutputSchema},
  prompt: `Generate a short, calming haiku or a brief Taoist reflection. The theme should be about focus, stillness, completing one task at a time, or the quiet strength of a stone. The reflection should be no more than three lines.`,
});

const getDailyReflectionFlow = ai.defineFlow(
  {
    name: 'getDailyReflectionFlow',
    outputSchema: DailyReflectionOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);

export async function getDailyReflection(): Promise<string> {
  return getDailyReflectionFlow();
}
