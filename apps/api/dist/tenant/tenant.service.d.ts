import { PrismaService } from '../prisma/prisma.service';
export declare class TenantService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        plan: import("@prisma/client").$Enums.Plan;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findBySlug(slug: string): import("@prisma/client").Prisma.Prisma__TenantClient<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        plan: import("@prisma/client").$Enums.Plan;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: {
        name?: string;
        logoUrl?: string;
        primaryColor?: string;
        secondaryColor?: string;
        domain?: string;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        primaryColor: string;
        secondaryColor: string;
        plan: import("@prisma/client").$Enums.Plan;
    }>;
    getUsage(tenantId: string): Promise<{
        workflows: number;
        executions: number;
        users: number;
    }>;
}
