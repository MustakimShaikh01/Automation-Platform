import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ExecutionModule } from './execution/execution.module';
import { IntegrationModule } from './integration/integration.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { AiModule } from './ai/ai.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('RATE_LIMIT_TTL', 60),
            limit: config.get('RATE_LIMIT_MAX', 100),
          },
        ],
      }),
    }),
    PrismaModule,
    AuthModule,
    TenantModule,
    UserModule,
    WorkflowModule,
    ExecutionModule,
    IntegrationModule,
    WebhookModule,
    QueueModule,
    AiModule,
    HealthModule,
  ],
})
export class AppModule {}
