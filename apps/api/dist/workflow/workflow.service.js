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
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let WorkflowService = class WorkflowService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.workflow.findMany({
            where: { tenantId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { executions: true } },
                user: { select: { name: true, avatarUrl: true } },
            },
        });
    }
    async findOne(id, tenantId) {
        const workflow = await this.prisma.workflow.findFirst({
            where: { id, tenantId },
            include: {
                executions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!workflow)
            throw new common_1.NotFoundException('Workflow not found');
        return workflow;
    }
    async create(dto, tenantId, userId) {
        const webhookUrl = `${process.env.API_URL}/api/v1/webhooks/trigger/${(0, uuid_1.v4)()}`;
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
    async update(id, dto, tenantId) {
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
    async delete(id, tenantId) {
        await this.assertOwnership(id, tenantId);
        return this.prisma.workflow.delete({ where: { id } });
    }
    async toggle(id, tenantId) {
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
    async assertOwnership(id, tenantId) {
        const wf = await this.prisma.workflow.findFirst({ where: { id, tenantId } });
        if (!wf)
            throw new common_1.NotFoundException('Workflow not found');
        return wf;
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map