import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExecutionStatus } from '@prisma/client';

@Injectable()
export class ExecutionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { workflowId: string; tenantId: string; userId?: string; triggerData?: any }) {
    return this.prisma.execution.create({
      data: {
        workflowId: data.workflowId,
        tenantId: data.tenantId,
        userId: data.userId,
        triggerData: data.triggerData,
        status: 'PENDING',
      },
    });
  }

  async updateStatus(id: string, status: ExecutionStatus, updates?: any) {
    return this.prisma.execution.update({
      where: { id },
      data: { status, ...updates },
    });
  }

  async findAll(tenantId: string, workflowId?: string, limit = 50) {
    return this.prisma.execution.findMany({
      where: { tenantId, ...(workflowId ? { workflowId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        workflow: { select: { name: true } },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.execution.findFirst({
      where: { id, tenantId },
      include: { workflow: { select: { name: true, graph: true } } },
    });
  }

  async getStats(tenantId: string) {
    const [total, success, failed, running] = await Promise.all([
      this.prisma.execution.count({ where: { tenantId } }),
      this.prisma.execution.count({ where: { tenantId, status: 'SUCCESS' } }),
      this.prisma.execution.count({ where: { tenantId, status: 'FAILED' } }),
      this.prisma.execution.count({ where: { tenantId, status: 'RUNNING' } }),
    ]);
    const avgDuration = await this.prisma.execution.aggregate({
      where: { tenantId, status: 'SUCCESS', duration: { not: null } },
      _avg: { duration: true },
    });
    return {
      total,
      success,
      failed,
      running,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
      avgDurationMs: Math.round(avgDuration._avg.duration || 0),
    };
  }
}
