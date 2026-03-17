export declare class HealthController {
    check(): {
        status: string;
        service: string;
        version: string;
        timestamp: string;
        uptime: number;
    };
    ready(): {
        status: string;
    };
}
