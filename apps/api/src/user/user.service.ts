import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email }, include: { tenant: true } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { tenant: true } });
  }

  findAllInTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, lastLoginAt: true, createdAt: true },
    });
  }
}
