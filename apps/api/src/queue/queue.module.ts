import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ExecutionWorker } from './execution.worker';
import { ExecutionModule } from '../execution/execution.module';
import { IntegrationModule } from '../integration/integration.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [ExecutionModule, IntegrationModule, AiModule],
  providers: [QueueService, ExecutionWorker],
  exports: [QueueService],
})
export class QueueModule {}
