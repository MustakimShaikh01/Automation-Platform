import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date;
        createdAt: Date;
    }[]>;
}
