import { IntegrationService } from './integration.service';
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    findAll(req: any): Promise<{
        connected: boolean;
        connectedAt: any;
        provider: string;
        name: string;
        icon: string;
        description: string;
    }[]>;
    connect(provider: string, body: {
        credentials: Record<string, string>;
    }, req: any): Promise<any>;
    disconnect(provider: string, req: any): Promise<any>;
}
