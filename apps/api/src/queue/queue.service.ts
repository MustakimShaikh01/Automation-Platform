import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { ConfigService } from '@nestjs/config';

export const WORKFLOW_QUEUE = 'workflow-execution';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  public queue: Queue;
  private queueEvents: QueueEvents;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const connection = {
      host: new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).hostname,
      port: parseInt(new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).port || '6379'),
    };

    this.queue = new Queue(WORKFLOW_QUEUE, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 500 },
      },
    });

    this.queueEvents = new QueueEvents(WORKFLOW_QUEUE, { connection });
    this.logger.log(`Queue "${WORKFLOW_QUEUE}" initialized`);
  }

  async enqueueWorkflow(data: {
    workflowId: string;
    tenantId: string;
    userId?: string;
    triggerData: any;
    executionId: string;
  }) {
    const job = await this.queue.add('execute-workflow', data, {
      jobId: data.executionId,
    });
    this.logger.log(`Enqueued workflow job: ${job.id}`);
    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await Job.fromId(this.queue, jobId);
    if (!job) return null;
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
}
