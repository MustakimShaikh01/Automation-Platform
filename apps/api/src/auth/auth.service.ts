import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: any) {
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

  async register(dto: { email: string; name: string; password: string; tenantSlug?: string }) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    // Create or find tenant
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

  async googleLogin(profile: any) {
    let user = await this.userService.findByEmail(profile.email);
    if (!user) {
      // Auto-create tenant + user on first Google login
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

  async refreshToken(userId: string) {
    const user = await this.userService.findById(userId);
    return this.login(user);
  }
}
