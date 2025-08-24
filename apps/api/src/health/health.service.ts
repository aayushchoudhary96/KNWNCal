import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

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
  routes: Array<{ method: string; path: string }>;
}

@Injectable()
export class HealthService {
  private startTime = Date.now();

  constructor(
    private configService: ConfigService,
    private httpAdapterHost: HttpAdapterHost,
    private prisma: PrismaService,
  ) {}

  async getHealth(): Promise<HealthResponse> {
    const checks = await this.runChecks();
    const routes = this.getRoutes();
    
    const overallOk = Object.values(checks).every(
      check => check.severity !== 'critical' || check.ok
    );

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

  private async runChecks(): Promise<{ [key: string]: HealthCheck }> {
    const checks: { [key: string]: HealthCheck } = {};

    // API uptime check
    checks['api.uptime'] = {
      ok: true,
      message: 'API is running',
      details: {
        uptimeSec: Math.floor((Date.now() - this.startTime) / 1000),
        startTime: new Date(this.startTime).toISOString(),
      },
    };

    // JWT config check
    const jwtSecret = this.configService.get('JWT_ACCESS_SECRET');
    const jwtTtl = this.configService.get('JWT_ACCESS_TTL');
    
    if (!jwtSecret) {
      checks['auth.jwt'] = {
        ok: false,
        severity: 'critical',
        message: 'JWT_ACCESS_SECRET is not configured',
      };
    } else if (!jwtTtl) {
      checks['auth.jwt'] = {
        ok: false,
        severity: 'warn',
        message: 'JWT_ACCESS_TTL is not configured',
      };
    } else {
      checks['auth.jwt'] = {
        ok: true,
        message: 'JWT configuration is valid',
        details: { ttl: jwtTtl },
      };
    }

    // CORS check
    const corsOrigin = this.configService.get('CORS_ORIGIN', 'http://localhost:5173');
    checks['cors'] = {
      ok: true,
      message: 'CORS is configured',
      details: { allowedOrigin: corsOrigin },
    };

    // Database check using Prisma
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - startTime;
      
      // Check if we have users in the database
      const userCount = await this.prisma.user.count();
      
      checks['database'] = {
        ok: true,
        latencyMs,
        message: 'Database connection is healthy',
        details: { 
          provider: 'sqlite',
          userCount,
          status: 'connected'
        },
      };
    } catch (error) {
      checks['database'] = {
        ok: false,
        severity: 'critical',
        message: 'Database connection failed',
        details: { 
          provider: 'sqlite',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
      };
    }

    // Storage check
    checks['storage'] = {
      ok: true,
      message: 'Uploads disabled in MVP',
      details: { configured: false },
    };

    return checks;
  }

  private getRoutes(): Array<{ method: string; path: string }> {
    try {
      const httpAdapter = this.httpAdapterHost.httpAdapter;
      if (httpAdapter && 'getInstance' in httpAdapter) {
        const instance = httpAdapter.getInstance();
        if (instance && instance._router && instance._router.stack) {
          const routes: Array<{ method: string; path: string }> = [];
          
          // This is a simplified route extraction - in production you might want more sophisticated parsing
          instance._router.stack.forEach((layer: any) => {
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
    } catch (error) {
      // If route extraction fails, return basic routes
    }
    
    return [
      { method: 'GET', path: '/api/health' },
      { method: 'GET', path: '/api/health/z' },
      { method: 'GET', path: '/api/health/z/ui' },
      { method: 'POST', path: '/api/auth/login' },
      { method: 'GET', path: '/api/auth/me' },
    ];
  }
}