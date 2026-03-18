import { TenantService } from './tenant.service';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    getMyTenant(req: any): import("@prisma/client").Prisma.Prisma__TenantClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getUsage(req: any): Promise<{
        workflows: number;
        executions: number;
        users: number;
    }>;
    updateBranding(req: any, dto: any): Promise<{
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
}
