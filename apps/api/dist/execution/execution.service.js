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
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExecutionService = class ExecutionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async updateStatus(id, status, updates) {
        return this.prisma.execution.update({
            where: { id },
            data: { status, ...updates },
        });
    }
    async findAll(tenantId, workflowId, limit = 50) {
        return this.prisma.execution.findMany({
            where: { tenantId, ...(workflowId ? { workflowId } : {}) },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                workflow: { select: { name: true } },
            },
        });
    }
    async findOne(id, tenantId) {
        return this.prisma.execution.findFirst({
            where: { id, tenantId },
            include: { workflow: { select: { name: true, graph: true } } },
        });
    }
    async getStats(tenantId) {
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
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map