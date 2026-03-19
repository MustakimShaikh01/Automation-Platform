import { PrismaService } from '../prisma/prisma.service';
export declare class WorkflowService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<({
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
    findOne(id: string, tenantId: string): Promise<{
        executions: {
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
    create(dto: any, tenantId: string, userId: string): Promise<{
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
    update(id: string, dto: any, tenantId: string): Promise<{
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
    delete(id: string, tenantId: string): Promise<{
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
    toggle(id: string, tenantId: string): Promise<{
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
    getTemplates(): Promise<{
        id: string;
        name: string;
        description: string;
        graph: import("@prisma/client/runtime/library").JsonValue;
        triggerType: import("@prisma/client").$Enums.TriggerType;
    }[]>;
    private assertOwnership;
}
