import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    summarize(body: {
        text: string;
        prompt?: string;
    }): Promise<{
        summary: string;
    }>;
    classify(body: {
        text: string;
        categories: string[];
    }): Promise<any>;
    generate(body: {
        prompt: string;
        context?: any;
    }): Promise<{
        generated: string;
    }>;
    extract(body: {
        text: string;
        fields: string[];
    }): Promise<any>;
}
