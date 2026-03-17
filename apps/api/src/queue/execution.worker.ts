import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { WORKFLOW_QUEUE } from './queue.service';
import { ExecutionService } from '../execution/execution.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ExecutionWorker implements OnModuleInit {
  private readonly logger = new Logger(ExecutionWorker.name);
  private worker: Worker;

  constructor(
    private readonly config: ConfigService,
    private readonly executionService: ExecutionService,
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async onModuleInit() {
    const connection = {
      host: new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).hostname,
      port: parseInt(new URL(this.config.get('REDIS_URL', 'redis://localhost:6379')).port || '6379'),
    };

    this.worker = new Worker(
      WORKFLOW_QUEUE,
      async (job: Job) => this.processJob(job),
      { connection, concurrency: 10 },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`✅ Job ${job.id} completed`);
    });
    this.worker.on('failed', (job, err) => {
      this.logger.error(`❌ Job ${job?.id} failed: ${err.message}`);
    });

    this.logger.log('Execution worker started (concurrency: 10)');
  }

  private async processJob(job: Job) {
    const { workflowId, tenantId, executionId, triggerData } = job.data;
    const logs: any[] = [];
    const startedAt = new Date();

    // Mark execution as RUNNING
    await this.executionService.updateStatus(executionId, 'RUNNING', { startedAt });

    try {
      // Load workflow graph
      const workflow = await this.prisma.workflow.findUnique({
        where: { id: workflowId },
      });
      if (!workflow) throw new Error('Workflow not found');

      const graph = workflow.graph as { nodes: any[]; edges: any[] };
      const { nodes, edges } = graph;

      logs.push({ step: 'START', message: `Executing workflow: ${workflow.name}`, ts: new Date() });

      // Topological sort: execute nodes in order
      const executed = new Map<string, any>();
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      const inDegree = new Map<string, number>();
      nodes.forEach((n) => inDegree.set(n.id, 0));
      edges.forEach((e) => inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1));

      const queue: string[] = [];
      inDegree.forEach((v, k) => { if (v === 0) queue.push(k); });

      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        const node = nodeMap.get(nodeId);
        if (!node) continue;

        const result = await this.executeNode(node, triggerData, executed, tenantId);
        executed.set(nodeId, result);

        logs.push({
          step: node.data?.label || node.type,
          nodeId,
          result,
          ts: new Date(),
        });

        // Update job progress
        const progress = (executed.size / nodes.length) * 100;
        await job.updateProgress(progress);

        // Enqueue dependent nodes
        edges
          .filter((e) => e.source === nodeId)
          .forEach((e) => {
            const newDeg = (inDegree.get(e.target) || 1) - 1;
            inDegree.set(e.target, newDeg);
            if (newDeg === 0) queue.push(e.target);
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
    } catch (err) {
      const duration = Date.now() - startedAt.getTime();
      await this.executionService.updateStatus(executionId, 'FAILED', {
        logs,
        error: err.message,
        completedAt: new Date(),
        duration,
      });
      throw err; // re-throw for BullMQ retry
    }
  }

  private async executeNode(node: any, triggerData: any, executed: Map<string, any>, tenantId: string) {
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
        // Outbound webhook call
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(node.data.url, {
          method: node.data.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(triggerData),
        });
        return { status: res.status, ok: res.ok };

      case 'email':
        // Placeholder: integrate with SendGrid
        this.logger.log(`Email node: would send to ${node.data?.to}`);
        return { sent: true, to: node.data?.to };

      default:
        this.logger.warn(`Unknown node type: ${type}`);
        return { skipped: true, type };
    }
  }

  private evaluateCondition(value: any, operator: string, target: any): boolean {
    switch (operator) {
      case 'eq': return value == target;
      case 'neq': return value != target;
      case 'gt': return value > target;
      case 'lt': return value < target;
      case 'contains': return String(value).includes(target);
      default: return true;
    }
  }
}
