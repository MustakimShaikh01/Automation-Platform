import type { RawBodyRequest } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Request } from 'express';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    trigger(token: string, body: any, signature: string, req: RawBodyRequest<Request>): Promise<{
        accepted: boolean;
        executionId: string;
    }>;
    manualTrigger(workflowId: string, body: any, req: any): Promise<{
        accepted: boolean;
        executionId: string;
    }>;
}
