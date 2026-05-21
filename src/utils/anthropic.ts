import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '../config/env';

export const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export const callClaude = async (
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = response.content[0];
    if (content && content.type === 'text') {
      return content.text;
    }
    return '';
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
};
