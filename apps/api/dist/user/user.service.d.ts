import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<({
        tenant: {
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
        };
    } & {
        id: string;
        email: string;
        googleId: string | null;
        name: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: string): import("@prisma/client").Prisma.Prisma__UserClient<({
        tenant: {
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
        };
    } & {
        id: string;
        email: string;
        googleId: string | null;
        name: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAllInTenant(tenantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        createdAt: Date;
    }[]>;
}
