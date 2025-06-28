// src/ai/flows/type-tutor-explanation.ts
'use server';
/**
 * @fileOverview Explains Pokemon type matchups using analogies. 
 *
 * - typeTutorExplanation - A function that provides explanations for type matchups using analogies.
 * - TypeTutorExplanationInput - The input type for the typeTutorExplanation function.
 * - TypeTutorExplanationOutput - The return type for the typeTutorExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getEffectiveness } from '@/lib/pokemon-data';

const TypeTutorExplanationInputSchema = z.object({
  attackingType: z.string().describe('The attacking Pokemon type.'),
  defendingType: z.string().describe('The defending Pokemon type.'),
});

export type TypeTutorExplanationInput = z.infer<typeof TypeTutorExplanationInputSchema>;

const TypeTutorExplanationOutputSchema = z.object({
  explanation: z.string().describe('An explanation of the type matchup using an analogy.'),
});

export type TypeTutorExplanationOutput = z.infer<typeof TypeTutorExplanationOutputSchema>;

export async function typeTutorExplanation(input: TypeTutorExplanationInput): Promise<TypeTutorExplanationOutput> {
  return typeTutorExplanationFlow(input);
}

const PromptInputSchema = TypeTutorExplanationInputSchema.extend({
    effectiveness: z.string().describe('The effectiveness of the matchup (e.g., "Super Effective").'),
});

const prompt = ai.definePrompt({
  name: 'typeTutorExplanationPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: TypeTutorExplanationOutputSchema},
  prompt: `Explain why the attacking Pokemon type {{{attackingType}}} is {{{effectiveness}}} against the defending Pokemon type {{{defendingType}}}, using an analogy to make it easier to understand.`,
  temperature: 0.7,
});

const typeTutorExplanationFlow = ai.defineFlow(
  {
    name: 'typeTutorExplanationFlow',
    inputSchema: TypeTutorExplanationInputSchema,
    outputSchema: TypeTutorExplanationOutputSchema,
  },
  async input => {
    const { label: effectiveness } = getEffectiveness(
      input.attackingType,
      input.defendingType
    );

    const promptInput = {
      ...input,
      effectiveness,
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);
