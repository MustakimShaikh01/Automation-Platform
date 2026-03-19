import { PrismaService } from '../prisma/prisma.service';
import { ExecutionStatus } from '@prisma/client';
export declare class ExecutionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        workflowId: string;
        tenantId: string;
        userId?: string;
        triggerData?: any;
    }): Promise<{
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        tenantId: string;
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
    updateStatus(id: string, status: ExecutionStatus, updates?: any): Promise<{
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        tenantId: string;
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
    findAll(tenantId: string, workflowId?: string, limit?: number): Promise<({
        workflow: {
            name: string;
        };
    } & {
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        tenantId: string;
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
    findOne(id: string, tenantId: string): Promise<{
        workflow: {
            name: string;
            graph: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        tenantId: string;
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
    getStats(tenantId: string): Promise<{
        total: number;
        success: number;
        failed: number;
        running: number;
        successRate: number;
        avgDurationMs: number;
    }>;
}
