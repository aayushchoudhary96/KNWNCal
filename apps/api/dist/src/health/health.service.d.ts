import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export interface HealthCheck {
    ok: boolean;
    latencyMs?: number;
    message?: string;
    severity?: 'info' | 'warn' | 'critical';
    details?: any;
}
export interface HealthResponse {
    ok: boolean;
    checkedAt: string;
    app: {
        name: string;
        version?: string;
        commit?: string;
        startedAt: string;
        uptimeSec: number;
        env: string;
        port: number;
        apiPrefix: string;
    };
    checks: {
        [key: string]: HealthCheck;
    };
    routes: Array<{
        method: string;
        path: string;
    }>;
}
export declare class HealthService {
    private configService;
    private httpAdapterHost;
    private startTime;
    constructor(configService: ConfigService, httpAdapterHost: HttpAdapterHost);
    getHealth(): Promise<HealthResponse>;
    private runChecks;
    private getRoutes;
}
