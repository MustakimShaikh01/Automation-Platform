import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        createdAt: Date;
    }[]>;
}
