import type { AIProvider, GenerateTextParams, GenerateTextResult } from './provider.interface.js';
import { env } from '../../../config/env.js';

export class OpenAIProvider implements AIProvider {
  async generateText(params: GenerateTextParams): Promise<GenerateTextResult> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: params.maxTokens ?? 1024,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
      }),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || res.statusText}`);
    }

    return {
      text: data.choices?.[0]?.message?.content ?? '',
      tokensUsed: data.usage?.total_tokens ?? 0,
    };
  }
}
