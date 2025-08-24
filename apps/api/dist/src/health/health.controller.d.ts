import { Response } from 'express';
import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): {
        ok: boolean;
        timestamp: string;
    };
    getDetailedHealth(): Promise<import("./health.service").HealthResponse>;
    getHealthUI(res: Response): Promise<void>;
    private generateHealthHTML;
}
