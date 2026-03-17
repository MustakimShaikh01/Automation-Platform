import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExecutionService } from '../execution/execution.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class ExecutionWorker implements OnModuleInit {
    private readonly config;
    private readonly executionService;
    private readonly prisma;
    private readonly aiService;
    private readonly logger;
    private worker;
    constructor(config: ConfigService, executionService: ExecutionService, prisma: PrismaService, aiService: AiService);
    onModuleInit(): Promise<void>;
    private processJob;
    private executeNode;
    private evaluateCondition;
}
