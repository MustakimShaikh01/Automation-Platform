import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { WorkflowModule } from '../workflow/workflow.module';
import { QueueModule } from '../queue/queue.module';
import { ExecutionModule } from '../execution/execution.module';

@Module({
  imports: [WorkflowModule, QueueModule, ExecutionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
