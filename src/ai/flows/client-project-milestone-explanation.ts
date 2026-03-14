'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate AI-powered explanations for project milestones.
 *
 * - clientProjectMilestoneExplanation - A function that generates a clear and concise explanation for a given project milestone.
 * - ClientProjectMilestoneExplanationInput - The input type for the clientProjectMilestoneExplanation function.
 * - ClientProjectMilestoneExplanationOutput - The return type for the clientProjectMilestoneExplanation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClientProjectMilestoneExplanationInputSchema = z.object({
  milestoneName: z.string().describe('The name of the project milestone.'),
  language: z.enum(['en', 'am']).describe('The language in which to provide the explanation (en for English, am for Amharic).'),
});
export type ClientProjectMilestoneExplanationInput = z.infer<typeof ClientProjectMilestoneExplanationInputSchema>;

const ClientProjectMilestoneExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the project milestone, including what it entails and its importance.'),
});
export type ClientProjectMilestoneExplanationOutput = z.infer<typeof ClientProjectMilestoneExplanationOutputSchema>;

export async function clientProjectMilestoneExplanation(input: ClientProjectMilestoneExplanationInput): Promise<ClientProjectMilestoneExplanationOutput> {
  return clientProjectMilestoneExplanationFlow(input);
}

const explainMilestonePrompt = ai.definePrompt({
  name: 'explainMilestonePrompt',
  input: { schema: ClientProjectMilestoneExplanationInputSchema },
  output: { schema: ClientProjectMilestoneExplanationOutputSchema },
  prompt: `You are an expert project manager for PrimeFinish Pro, a luxury finishing and construction company. 
Provide a clear and concise explanation for the project milestone named "{{{milestoneName}}}".

The entire explanation MUST be written in the following language: {{{language}}} (where 'en' is English and 'am' is Amharic).

Requirements:
1. Describe what this milestone entails and the typical high-quality activities involved.
2. Explain its importance to the overall success of the luxury project.
3. Use a professional, respectful, and sophisticated tone.
4. If the language is Amharic ('am'), and the milestone is about completion (100%), start with or include: "ይህ ደረጃ (100%) ስራው ሙሉ በሙሉ መጠናቀቁን ያሳያል። ሁሉም የታቀዱ ተግባራት በስኬት ተከናውነዋል..."

The explanation should be easy for a premium client to understand without using overly technical construction jargon.`,
});

const clientProjectMilestoneExplanationFlow = ai.defineFlow(
  {
    name: 'clientProjectMilestoneExplanationFlow',
    inputSchema: ClientProjectMilestoneExplanationInputSchema,
    outputSchema: ClientProjectMilestoneExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await explainMilestonePrompt(input);
    return output!;
  }
);
