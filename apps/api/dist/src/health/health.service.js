"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
let HealthService = class HealthService {
    constructor(configService, httpAdapterHost) {
        this.configService = configService;
        this.httpAdapterHost = httpAdapterHost;
        this.startTime = Date.now();
    }
    async getHealth() {
        const checks = await this.runChecks();
        const routes = this.getRoutes();
        const overallOk = Object.values(checks).every(check => check.severity !== 'critical' || check.ok);
        return {
            ok: overallOk,
            checkedAt: new Date().toISOString(),
            app: {
                name: 'KnwnCal API',
                startedAt: new Date(this.startTime).toISOString(),
                uptimeSec: Math.floor((Date.now() - this.startTime) / 1000),
                env: this.configService.get('NODE_ENV', 'development'),
                port: this.configService.get('PORT', 4000),
                apiPrefix: '/api',
            },
            checks,
            routes,
        };
    }
    async runChecks() {
        const checks = {};
        checks['api.uptime'] = {
            ok: true,
            message: 'API is running',
            details: {
                uptimeSec: Math.floor((Date.now() - this.startTime) / 1000),
                startTime: new Date(this.startTime).toISOString(),
            },
        };
        const jwtSecret = this.configService.get('JWT_ACCESS_SECRET');
        const jwtTtl = this.configService.get('JWT_ACCESS_TTL');
        if (!jwtSecret) {
            checks['auth.jwt'] = {
                ok: false,
                severity: 'critical',
                message: 'JWT_ACCESS_SECRET is not configured',
            };
        }
        else if (!jwtTtl) {
            checks['auth.jwt'] = {
                ok: false,
                severity: 'warn',
                message: 'JWT_ACCESS_TTL is not configured',
            };
        }
        else {
            checks['auth.jwt'] = {
                ok: true,
                message: 'JWT configuration is valid',
                details: { ttl: jwtTtl },
            };
        }
        const corsOrigin = this.configService.get('CORS_ORIGIN', 'http://localhost:5173');
        checks['cors'] = {
            ok: true,
            message: 'CORS is configured',
            details: { allowedOrigin: corsOrigin },
        };
        checks['database'] = {
            ok: true,
            message: 'Database check disabled temporarily',
            details: { provider: 'sqlite', note: 'check disabled' },
        };
        checks['storage'] = {
            ok: true,
            message: 'Uploads disabled in MVP',
            details: { configured: false },
        };
        return checks;
    }
    getRoutes() {
        try {
            const httpAdapter = this.httpAdapterHost.httpAdapter;
            if (httpAdapter && 'getInstance' in httpAdapter) {
                const instance = httpAdapter.getInstance();
                if (instance && instance._router && instance._router.stack) {
                    const routes = [];
                    instance._router.stack.forEach((layer) => {
                        if (layer.route) {
                            const methods = Object.keys(layer.route.methods);
                            methods.forEach(method => {
                                routes.push({
                                    method: method.toUpperCase(),
                                    path: `/api${layer.route.path}`,
                                });
                            });
                        }
                    });
                    return routes;
                }
            }
        }
        catch (error) {
        }
        return [
            { method: 'GET', path: '/api/health' },
            { method: 'GET', path: '/api/health/z' },
            { method: 'GET', path: '/api/health/z/ui' },
            { method: 'POST', path: '/api/auth/login' },
            { method: 'GET', path: '/api/auth/me' },
        ];
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_1.HttpAdapterHost])
], HealthService);
//# sourceMappingURL=health.service.js.map