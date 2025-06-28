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

const prompt = ai.definePrompt({
  name: 'typeTutorExplanationPrompt',
  input: {schema: TypeTutorExplanationInputSchema},
  output: {schema: TypeTutorExplanationOutputSchema},
  prompt: `Explain why the attacking Pokemon type {{{attackingType}}} is {{effectiveness attackingType=attackingType defendingType=defendingType}} against the defending Pokemon type {{{defendingType}}}, using an analogy to make it easier to understand.`,
  temperature: 0.7,
  // Note: The effectiveness value is calculated in the React component.
  // This value will then need to be passed to the prompt.
});

const typeTutorExplanationFlow = ai.defineFlow(
  {
    name: 'typeTutorExplanationFlow',
    inputSchema: TypeTutorExplanationInputSchema,
    outputSchema: TypeTutorExplanationOutputSchema,
  },
  async input => {
    // Here, you might call an external API or database to fetch additional data if needed.
    // For this example, we'll just pass the input directly to the prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
