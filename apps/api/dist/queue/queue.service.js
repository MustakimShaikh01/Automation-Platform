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
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.WORKFLOW_QUEUE = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
exports.WORKFLOW_QUEUE = 'workflow-execution';
let QueueService = QueueService_1 = class QueueService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(QueueService_1.name);
    }
    async onModuleInit() {
        const connection = {
            host: new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).hostname,
            port: parseInt(new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).port || '6379'),
        };
        this.queue = new bullmq_1.Queue(exports.WORKFLOW_QUEUE, {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: { count: 1000 },
                removeOnFail: { count: 500 },
            },
        });
        this.queueEvents = new bullmq_1.QueueEvents(exports.WORKFLOW_QUEUE, { connection });
        this.logger.log(`Queue "${exports.WORKFLOW_QUEUE}" initialized`);
    }
    async enqueueWorkflow(data) {
        const job = await this.queue.add('execute-workflow', data, {
            jobId: data.executionId,
        });
        this.logger.log(`Enqueued workflow job: ${job.id}`);
        return job;
    }
    async getJobStatus(jobId) {
        const job = await bullmq_1.Job.fromId(this.queue, jobId);
        if (!job)
            return null;
        const state = await job.getState();
        return { id: job.id, state, data: job.data, progress: job.progress };
    }
    async getQueueStats() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.queue.getWaitingCount(),
            this.queue.getActiveCount(),
            this.queue.getCompletedCount(),
            this.queue.getFailedCount(),
        ]);
        return { waiting, active, completed, failed };
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueService);
//# sourceMappingURL=queue.service.js.map