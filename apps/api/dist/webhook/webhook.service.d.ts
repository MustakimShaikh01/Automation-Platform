import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { ExecutionService } from '../execution/execution.service';
export declare class WebhookService {
    private readonly prisma;
    private readonly queueService;
    private readonly executionService;
    private readonly logger;
    constructor(prisma: PrismaService, queueService: QueueService, executionService: ExecutionService);
    handleIncoming(webhookToken: string, payload: any, signature?: string, rawBody?: Buffer): Promise<{
        accepted: boolean;
        executionId: string;
    }>;
    triggerManual(workflowId: string, tenantId: string, userId: string, payload?: any): Promise<{
        accepted: boolean;
        executionId: string;
    }>;
}
