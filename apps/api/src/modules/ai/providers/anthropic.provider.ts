import type { AIProvider, GenerateTextParams, GenerateTextResult } from './provider.interface.js';
import { env } from '../../../config/env.js';

export class AnthropicProvider implements AIProvider {
  async generateText(params: GenerateTextParams): Promise<GenerateTextResult> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: params.maxTokens ?? 1024,
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
      }),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      throw new Error(`Anthropic API error: ${data.error?.message || res.statusText}`);
    }

    return {
      text: data.content?.[0]?.text ?? '',
      tokensUsed: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
    };
  }
}
