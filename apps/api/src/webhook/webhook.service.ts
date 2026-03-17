import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { ExecutionService } from '../execution/execution.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
    private readonly executionService: ExecutionService,
  ) {}

  async handleIncoming(webhookToken: string, payload: any, signature?: string, rawBody?: Buffer) {
    // Find workflow by webhook URL suffix
    const workflow = await this.prisma.workflow.findFirst({
      where: {
        webhookUrl: { endsWith: webhookToken },
        isActive: true,
      },
    });

    if (!workflow) throw new NotFoundException('Webhook not found or workflow is inactive');

    // HMAC signature validation
    if (process.env.WEBHOOK_SECRET && signature) {
      const expectedSig = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(rawBody || Buffer.from(JSON.stringify(payload)))
        .digest('hex');

      if (signature !== `sha256=${expectedSig}`) {
        throw new UnauthorizedException('Invalid webhook signature');
      }
    }

    // Create execution record
    const execution = await this.executionService.create({
      workflowId: workflow.id,
      tenantId: workflow.tenantId,
      triggerData: payload,
    });

    // Push to queue
    await this.queueService.enqueueWorkflow({
      workflowId: workflow.id,
      tenantId: workflow.tenantId,
      triggerData: payload,
      executionId: execution.id,
    });

    this.logger.log(`Webhook triggered workflow ${workflow.id} → execution ${execution.id}`);
    return { accepted: true, executionId: execution.id };
  }

  async triggerManual(workflowId: string, tenantId: string, userId: string, payload?: any) {
    const workflow = await this.prisma.workflow.findFirst({ where: { id: workflowId, tenantId } });
    if (!workflow) throw new NotFoundException('Workflow not found');

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
}
