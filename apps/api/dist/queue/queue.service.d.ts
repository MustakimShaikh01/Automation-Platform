import { OnModuleInit } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare const WORKFLOW_QUEUE = "workflow-execution";
export declare class QueueService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    queue: Queue;
    private queueEvents;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    enqueueWorkflow(data: {
        workflowId: string;
        tenantId: string;
        userId?: string;
        triggerData: any;
        executionId: string;
    }): Promise<Job<any, any, string>>;
    getJobStatus(jobId: string): Promise<{
        id: string;
        state: import("bullmq").JobState | "unknown";
        data: any;
        progress: import("bullmq").JobProgress;
    }>;
    getQueueStats(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
}
