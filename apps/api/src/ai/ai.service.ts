import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async processNode(nodeData: any, input: any, tenantId: string): Promise<any> {
    if (!this.openai) {
      return { error: 'OpenAI not configured', skipped: true };
    }

    const { action, prompt, model = 'gpt-4o-mini' } = nodeData;

    switch (action) {
      case 'summarize':
        return this.summarize(input, prompt, model);
      case 'classify':
        return this.classify(input, nodeData.categories, model);
      case 'generate':
        return this.generate(prompt, input, model);
      case 'extract':
        return this.extract(input, nodeData.fields, model);
      case 'decision':
        return this.decide(input, prompt, model);
      default:
        return this.chat(prompt || 'Analyze this data', JSON.stringify(input), model);
    }
  }

  async summarize(text: any, customPrompt?: string, model = 'gpt-4o-mini') {
    const content = typeof text === 'string' ? text : JSON.stringify(text);
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: customPrompt || 'Summarize the following in 2-3 concise sentences.' },
        { role: 'user', content },
      ],
      max_tokens: 300,
    });
    return { summary: response.choices[0].message.content };
  }

  async classify(text: any, categories: string[] = [], model = 'gpt-4o-mini') {
    const content = typeof text === 'string' ? text : JSON.stringify(text);
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Classify the input into one of these categories: ${categories.join(', ')}. Respond with JSON: {"category": "...", "confidence": 0.95}`,
        },
        { role: 'user', content },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async generate(prompt: string, context: any, model = 'gpt-4o-mini') {
    const contextStr = typeof context === 'string' ? context : JSON.stringify(context);
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful automation assistant.' },
        { role: 'user', content: `${prompt}\n\nContext: ${contextStr}` },
      ],
      max_tokens: 1000,
    });
    return { generated: response.choices[0].message.content };
  }

  async extract(text: any, fields: string[], model = 'gpt-4o-mini') {
    const content = typeof text === 'string' ? text : JSON.stringify(text);
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Extract the following fields from the text and return JSON: ${fields.join(', ')}`,
        },
        { role: 'user', content },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async decide(input: any, prompt: string, model = 'gpt-4o-mini') {
    const content = typeof input === 'string' ? input : JSON.stringify(input);
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `${prompt}\n\nRespond with JSON: {"decision": "yes|no", "reason": "...", "route": "A|B"}`,
        },
        { role: 'user', content },
      ],
      response_format: { type: 'json_object' },
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async chat(systemPrompt: string, userMessage: string, model = 'gpt-4o-mini') {
    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });
    return { response: response.choices[0].message.content };
  }
}
