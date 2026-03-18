import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly config;
    private readonly logger;
    private openai;
    constructor(config: ConfigService);
    processNode(nodeData: any, input: any, tenantId: string): Promise<any>;
    summarize(text: any, customPrompt?: string, model?: string): Promise<{
        summary: string;
    }>;
    classify(text: any, categories?: string[], model?: string): Promise<any>;
    generate(prompt: string, context: any, model?: string): Promise<{
        generated: string;
    }>;
    extract(text: any, fields: string[], model?: string): Promise<any>;
    decide(input: any, prompt: string, model?: string): Promise<any>;
    chat(systemPrompt: string, userMessage: string, model?: string): Promise<{
        response: string;
    }>;
}
