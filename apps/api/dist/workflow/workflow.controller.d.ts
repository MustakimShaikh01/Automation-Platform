import { WorkflowService } from './workflow.service';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    findAll(req: any): Promise<({
        user: {
            name: string;
            avatarUrl: string;
        };
        _count: {
            executions: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    })[]>;
    getTemplates(): Promise<{
        id: string;
        name: string;
        description: string;
        graph: import("@prisma/client/runtime/library").JsonValue;
        triggerType: import("@prisma/client").$Enums.TriggerType;
    }[]>;
    findOne(id: string, req: any): Promise<{
        executions: {
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
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    }>;
    create(dto: any, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    }>;
    update(id: string, dto: any, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    }>;
    toggle(id: string, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    }>;
    delete(id: string, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        graph: import("@prisma/client/runtime/library").JsonValue;
        isTemplate: boolean;
        triggerType: import("@prisma/client").$Enums.TriggerType;
        webhookUrl: string | null;
        schedule: string | null;
        userId: string;
    }>;
}
