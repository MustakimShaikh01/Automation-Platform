import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async update(id: string, dto: {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
  }) {
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  async getUsage(tenantId: string) {
    const [workflows, executions, users] = await Promise.all([
      this.prisma.workflow.count({ where: { tenantId } }),
      this.prisma.execution.count({ where: { tenantId } }),
      this.prisma.user.count({ where: { tenantId } }),
    ]);
    return { workflows, executions, users };
  }
}
