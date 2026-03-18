import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly prisma;
    constructor(userService: UserService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        googleId: string | null;
        passwordHash: string | null;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    login(user: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
    register(dto: {
        email: string;
        name: string;
        password: string;
        tenantSlug?: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
    googleLogin(profile: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            tenantId: any;
            avatarUrl: any;
        };
    }>;
}
