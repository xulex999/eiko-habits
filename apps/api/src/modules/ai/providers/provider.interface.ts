export interface GenerateTextParams {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface GenerateTextResult {
  text: string;
  tokensUsed: number;
}

export interface AIProvider {
  generateText(params: GenerateTextParams): Promise<GenerateTextResult>;
}
