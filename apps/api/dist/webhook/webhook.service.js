"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
const execution_service_1 = require("../execution/execution.service");
const crypto = __importStar(require("crypto"));
let WebhookService = WebhookService_1 = class WebhookService {
    prisma;
    queueService;
    executionService;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(prisma, queueService, executionService) {
        this.prisma = prisma;
        this.queueService = queueService;
        this.executionService = executionService;
    }
    async handleIncoming(webhookToken, payload, signature, rawBody) {
        const workflow = await this.prisma.workflow.findFirst({
            where: {
                webhookUrl: { endsWith: webhookToken },
                isActive: true,
            },
        });
        if (!workflow)
            throw new common_1.NotFoundException('Webhook not found or workflow is inactive');
        if (process.env.WEBHOOK_SECRET && signature) {
            const expectedSig = crypto
                .createHmac('sha256', process.env.WEBHOOK_SECRET)
                .update(rawBody || Buffer.from(JSON.stringify(payload)))
                .digest('hex');
            if (signature !== `sha256=${expectedSig}`) {
                throw new common_1.UnauthorizedException('Invalid webhook signature');
            }
        }
        const execution = await this.executionService.create({
            workflowId: workflow.id,
            tenantId: workflow.tenantId,
            triggerData: payload,
        });
        await this.queueService.enqueueWorkflow({
            workflowId: workflow.id,
            tenantId: workflow.tenantId,
            triggerData: payload,
            executionId: execution.id,
        });
        this.logger.log(`Webhook triggered workflow ${workflow.id} → execution ${execution.id}`);
        return { accepted: true, executionId: execution.id };
    }
    async triggerManual(workflowId, tenantId, userId, payload) {
        const workflow = await this.prisma.workflow.findFirst({ where: { id: workflowId, tenantId } });
        if (!workflow)
            throw new common_1.NotFoundException('Workflow not found');
        const execution = await this.executionService.create({
            workflowId,
            tenantId,
            userId,
            triggerData: payload || {},
        });
        await this.queueService.enqueueWorkflow({
            workflowId,
            tenantId,
            userId,
            triggerData: payload || {},
            executionId: execution.id,
        });
        return { accepted: true, executionId: execution.id };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService,
        execution_service_1.ExecutionService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map