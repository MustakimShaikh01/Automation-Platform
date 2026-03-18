import { ExecutionService } from './execution.service';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    findAll(req: any, workflowId?: string, limit?: string): Promise<({
        workflow: {
            name: string;
        };
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        tenantId: string;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        triggerData: import("@prisma/client/runtime/library").JsonValue | null;
        logs: import("@prisma/client/runtime/library").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
        duration: number | null;
        retryCount: number;
        workflowId: string;
    })[]>;
    stats(req: any): Promise<{
        total: number;
        success: number;
        failed: number;
        running: number;
        successRate: number;
        avgDurationMs: number;
    }>;
    findOne(id: string, req: any): Promise<{
        workflow: {
            name: string;
            graph: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        error: string | null;
        id: string;
        createdAt: Date;
        tenantId: string;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        triggerData: import("@prisma/client/runtime/library").JsonValue | null;
        logs: import("@prisma/client/runtime/library").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
        duration: number | null;
        retryCount: number;
        workflowId: string;
    }>;
}
