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
var ExecutionWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionWorker = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
const queue_service_1 = require("./queue.service");
const execution_service_1 = require("../execution/execution.service");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let ExecutionWorker = ExecutionWorker_1 = class ExecutionWorker {
    constructor(config, executionService, prisma, aiService) {
        this.config = config;
        this.executionService = executionService;
        this.prisma = prisma;
        this.aiService = aiService;
        this.logger = new common_1.Logger(ExecutionWorker_1.name);
    }
    async onModuleInit() {
        const connection = {
            host: new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).hostname,
            port: parseInt(new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).port || '6379'),
        };
        this.worker = new bullmq_1.Worker(queue_service_1.WORKFLOW_QUEUE, async (job) => this.processJob(job), { connection, concurrency: 10 });
        this.worker.on('completed', (job) => {
            this.logger.log(`✅ Job ${job.id} completed`);
        });
        this.worker.on('failed', (job, err) => {
            this.logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
        });
        this.logger.log('Execution worker started (concurrency: 10)');
    }
    async processJob(job) {
        const { workflowId, tenantId, executionId, triggerData } = job.data;
        const logs = [];
        const startedAt = new Date();
        await this.executionService.updateStatus(executionId, 'RUNNING', { startedAt });
        try {
            const workflow = await this.prisma.workflow.findUnique({
                where: { id: workflowId },
            });
            if (!workflow)
                throw new Error('Workflow not found');
            const graph = workflow.graph;
            const { nodes, edges } = graph;
            logs.push({ step: 'START', message: `Executing workflow: ${workflow.name}`, ts: new Date() });
            const executed = new Map();
            const nodeMap = new Map(nodes.map((n) => [n.id, n]));
            const inDegree = new Map();
            nodes.forEach((n) => inDegree.set(n.id, 0));
            edges.forEach((e) => inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1));
            const queue = [];
            inDegree.forEach((v, k) => { if (v === 0)
                queue.push(k); });
            while (queue.length > 0) {
                const nodeId = queue.shift();
                const node = nodeMap.get(nodeId);
                if (!node)
                    continue;
                const result = await this.executeNode(node, triggerData, executed, tenantId);
                executed.set(nodeId, result);
                logs.push({
                    step: node.data?.label || node.type,
                    nodeId,
                    result,
                    ts: new Date(),
                });
                const progress = (executed.size / nodes.length) * 100;
                await job.updateProgress(progress);
                edges
                    .filter((e) => e.source === nodeId)
                    .forEach((e) => {
                    const newDeg = (inDegree.get(e.target) || 1) - 1;
                    inDegree.set(e.target, newDeg);
                    if (newDeg === 0)
                        queue.push(e.target);
                });
            }
            const duration = Date.now() - startedAt.getTime();
            await this.executionService.updateStatus(executionId, 'SUCCESS', {
                logs,
                result: Object.fromEntries(executed),
                completedAt: new Date(),
                duration,
            });
            return { success: true, duration };
        }
        catch (err) {
            const duration = Date.now() - startedAt.getTime();
            await this.executionService.updateStatus(executionId, 'FAILED', {
                logs,
                error: err.message,
                completedAt: new Date(),
                duration,
            });
            throw err;
        }
    }
    async executeNode(node, triggerData, executed, tenantId) {
        const type = node.type || node.data?.type;
        switch (type) {
            case 'trigger':
                return triggerData;
            case 'ai':
                return this.aiService.processNode(node.data, triggerData, tenantId);
            case 'condition': {
                const { field, operator, value } = node.data;
                const input = triggerData[field];
                const result = this.evaluateCondition(input, operator, value);
                return { pass: result };
            }
            case 'delay':
                await new Promise((r) => setTimeout(r, (node.data?.seconds || 1) * 1000));
                return { delayed: true };
            case 'webhook':
                const fetch = (await Promise.resolve().then(() => require('node-fetch'))).default;
                const res = await fetch(node.data.url, {
                    method: node.data.method || 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(triggerData),
                });
                return { status: res.status, ok: res.ok };
            case 'email':
                this.logger.log(`Email node: would send to ${node.data?.to}`);
                return { sent: true, to: node.data?.to };
            default:
                this.logger.warn(`Unknown node type: ${type}`);
                return { skipped: true, type };
        }
    }
    evaluateCondition(value, operator, target) {
        switch (operator) {
            case 'eq': return value == target;
            case 'neq': return value != target;
            case 'gt': return value > target;
            case 'lt': return value < target;
            case 'contains': return String(value).includes(target);
            default: return true;
        }
    }
};
exports.ExecutionWorker = ExecutionWorker;
exports.ExecutionWorker = ExecutionWorker = ExecutionWorker_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        execution_service_1.ExecutionService,
        prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ExecutionWorker);
//# sourceMappingURL=execution.worker.js.map