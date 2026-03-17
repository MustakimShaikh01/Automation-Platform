import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger docs
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Autoify API')
      .setDescription('Zapier-level Automation SaaS — REST API')
      .setVersion('2.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('workflows', 'Workflow CRUD & execution')
      .addTag('executions', 'Execution logs & monitoring')
      .addTag('integrations', 'Connected apps management')
      .addTag('webhooks', 'Inbound webhook processing')
      .addTag('ai', 'AI automation nodes')
      .addTag('tenants', 'Multi-tenant management')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger docs available at http://localhost:4000/api/docs');
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Autoify API running on http://localhost:${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV}`);
}

bootstrap();
