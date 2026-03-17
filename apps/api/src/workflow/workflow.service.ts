import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.workflow.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { executions: true } },
        user: { select: { name: true, avatarUrl: true } },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, tenantId },
      include: {
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async create(dto: any, tenantId: string, userId: string) {
    const webhookUrl = `${process.env.API_URL}/api/v1/webhooks/trigger/${uuidv4()}`;
    return this.prisma.workflow.create({
      data: {
        name: dto.name,
        description: dto.description,
        graph: dto.graph || { nodes: [], edges: [] },
        triggerType: dto.triggerType || 'MANUAL',
        webhookUrl,
        tenantId,
        userId,
      },
    });
  }

  async update(id: string, dto: any, tenantId: string) {
    await this.assertOwnership(id, tenantId);
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        graph: dto.graph,
        isActive: dto.isActive,
        triggerType: dto.triggerType,
        schedule: dto.schedule,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string, tenantId: string) {
    await this.assertOwnership(id, tenantId);
    return this.prisma.workflow.delete({ where: { id } });
  }

  async toggle(id: string, tenantId: string) {
    const workflow = await this.assertOwnership(id, tenantId);
    return this.prisma.workflow.update({
      where: { id },
      data: { isActive: !workflow.isActive },
    });
  }

  async getTemplates() {
    return this.prisma.workflow.findMany({
      where: { isTemplate: true },
      select: { id: true, name: true, description: true, graph: true, triggerType: true },
    });
  }

  private async assertOwnership(id: string, tenantId: string) {
    const wf = await this.prisma.workflow.findFirst({ where: { id, tenantId } });
    if (!wf) throw new NotFoundException('Workflow not found');
    return wf;
  }
}
