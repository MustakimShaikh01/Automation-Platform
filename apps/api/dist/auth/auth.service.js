"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userService, jwtService, prisma) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user || !user.passwordHash)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            tenantId: user.tenantId,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    async register(dto) {
        const existing = await this.userService.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already registered');
        let tenant = await this.prisma.tenant.findFirst({ where: { slug: dto.tenantSlug || dto.email.split('@')[1].replace('.', '-') } });
        if (!tenant) {
            tenant = await this.prisma.tenant.create({
                data: {
                    name: dto.name + "'s Workspace",
                    slug: `workspace-${Date.now()}`,
                    plan: 'STARTER',
                },
            });
        }
        const hash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                passwordHash: hash,
                role: 'OWNER',
                tenantId: tenant.id,
            },
            include: { tenant: true }
        });
        return this.login(user);
    }
    async googleLogin(profile) {
        let user = await this.userService.findByEmail(profile.email);
        if (!user) {
            const tenant = await this.prisma.tenant.create({
                data: {
                    name: profile.displayName + "'s Workspace",
                    slug: `workspace-${Date.now()}`,
                    plan: 'STARTER',
                },
            });
            user = await this.prisma.user.create({
                data: {
                    email: profile.email,
                    name: profile.displayName,
                    googleId: profile.id,
                    avatarUrl: profile.picture,
                    role: 'OWNER',
                    tenantId: tenant.id,
                },
                include: { tenant: true }
            });
        }
        return this.login(user);
    }
    async refreshToken(userId) {
        const user = await this.userService.findById(userId);
        return this.login(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map