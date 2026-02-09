import type { AIProvider } from './provider.interface.js';
import { AnthropicProvider } from './anthropic.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { env } from '../../../config/env.js';

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  if (env.ANTHROPIC_API_KEY) {
    cachedProvider = new AnthropicProvider();
  } else if (env.OPENAI_API_KEY) {
    cachedProvider = new OpenAIProvider();
  } else {
    throw new Error('No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
  }

  return cachedProvider;
}

export type { AIProvider, GenerateTextParams, GenerateTextResult } from './provider.interface.js';
