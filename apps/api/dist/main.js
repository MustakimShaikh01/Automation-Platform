"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api/v1');
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
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
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        logger.log('Swagger docs available at http://localhost:4000/api/docs');
    }
    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`🚀 Autoify API running on http://localhost:${port}`);
    logger.log(`📊 Environment: ${process.env.NODE_ENV}`);
}
bootstrap();
//# sourceMappingURL=main.js.map