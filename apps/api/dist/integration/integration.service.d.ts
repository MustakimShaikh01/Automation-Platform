import { PrismaService } from '../prisma/prisma.service';
export declare const AVAILABLE_INTEGRATIONS: {
    provider: string;
    name: string;
    icon: string;
    description: string;
}[];
export declare class IntegrationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        connected: boolean;
        connectedAt: any;
        provider: string;
        name: string;
        icon: string;
        description: string;
    }[]>;
    connect(tenantId: string, provider: string, credentials: Record<string, string>): Promise<any>;
    disconnect(tenantId: string, provider: string): Promise<any>;
    getCredentials(tenantId: string, provider: string): Promise<Record<string, string> | null>;
}
