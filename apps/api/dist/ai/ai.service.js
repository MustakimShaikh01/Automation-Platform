"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let AiService = AiService_1 = class AiService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AiService_1.name);
        const apiKey = this.config.get('OPENAI_API_KEY');
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async processNode(nodeData, input, tenantId) {
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
    async summarize(text, customPrompt, model = 'gpt-4o-mini') {
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
    async classify(text, categories = [], model = 'gpt-4o-mini') {
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
    async generate(prompt, context, model = 'gpt-4o-mini') {
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
    async extract(text, fields, model = 'gpt-4o-mini') {
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
    async decide(input, prompt, model = 'gpt-4o-mini') {
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
    async chat(systemPrompt, userMessage, model = 'gpt-4o-mini') {
        const response = await this.openai.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
        });
        return { response: response.choices[0].message.content };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map