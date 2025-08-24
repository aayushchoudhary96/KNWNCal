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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    check() {
        return { ok: true, timestamp: new Date().toISOString() };
    }
    async getDetailedHealth() {
        return this.healthService.getHealth();
    }
    async getHealthUI(res) {
        const health = await this.healthService.getHealth();
        const html = this.generateHealthHTML(health);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    generateHealthHTML(health) {
        const statusColor = health.ok ? '#10b981' : '#ef4444';
        const statusText = health.ok ? '✅ HEALTHY' : '❌ UNHEALTHY';
        const checksHTML = Object.entries(health.checks).map(([key, check]) => {
            const dotClass = check.ok ? 'ok' : check.severity || 'critical';
            const detailsHTML = check.details ? `<div class="check-details">${JSON.stringify(check.details)}</div>` : '';
            return `
        <div class="check-item">
          <div class="status-dot ${dotClass}"></div>
          <div class="check-info">
            <div class="check-name">${key}</div>
            <div class="check-message">${check.message || 'No message'}</div>
            ${detailsHTML}
          </div>
        </div>
      `;
        }).join('');
        const routesHTML = health.routes.map((route) => `
      <div class="route-item">
        <span class="method ${route.method}">${route.method}</span>
        <span>${route.path}</span>
      </div>
    `).join('');
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnwnCal API Health Dashboard</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: ${statusColor}; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .status { font-size: 18px; margin-top: 10px; }
        .content { padding: 20px; }
        .checks { margin-bottom: 30px; }
        .check-item { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
        .check-item:last-child { border-bottom: none; }
        .status-dot { width: 12px; height: 12px; border-radius: 50%; margin-right: 15px; }
        .status-dot.ok { background: #10b981; }
        .status-dot.warn { background: #f59e0b; }
        .status-dot.critical { background: #ef4444; }
        .check-info { flex: 1; }
        .check-name { font-weight: 600; margin-bottom: 4px; }
        .check-message { color: #666; font-size: 14px; }
        .check-details { color: #888; font-size: 12px; margin-top: 4px; }
        .routes { margin-top: 20px; }
        .routes-header { cursor: pointer; padding: 15px; background: #f8f9fa; border-radius: 6px; margin-bottom: 15px; }
        .routes-content { display: none; }
        .routes-content.show { display: block; }
        .route-item { padding: 8px 12px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 14px; }
        .route-item:last-child { border-bottom: none; }
        .method { display: inline-block; width: 60px; font-weight: 600; }
        .method.GET { color: #059669; }
        .method.POST { color: #dc2626; }
        .method.PUT { color: #7c3aed; }
        .method.PATCH { color: #ea580c; }
        .method.DELETE { color: #dc2626; }
        .timestamp { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
        .refresh-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; }
        .refresh-btn:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 KnwnCal API Health Dashboard</h1>
            <div class="status">
                ${statusText}
            </div>
        </div>
        
        <div class="content">
            <div class="checks">
                <h2>System Checks</h2>
                ${checksHTML}
            </div>
            
            <div class="routes">
                <div class="routes-header" onclick="toggleRoutes()">
                    <h3>📋 Registered Routes (${health.routes.length})</h3>
                </div>
                <div class="routes-content" id="routesContent">
                    ${routesHTML}
                </div>
            </div>
            
            <div class="timestamp">
                Last checked: ${new Date(health.checkedAt).toLocaleString()}
            </div>
        </div>
    </div>
    
    <button class="refresh-btn" onclick="refreshPage()">🔄 Refresh</button>
    
    <script>
        function toggleRoutes() {
            const content = document.getElementById('routesContent');
            content.classList.toggle('show');
        }
        
        function refreshPage() {
            location.reload();
        }
        
        // Auto-refresh every 10 seconds
        setTimeout(() => {
            location.reload();
        }, 10000);
    </script>
</body>
</html>`;
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('z'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDetailedHealth", null);
__decorate([
    (0, common_1.Get)('z/ui'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealthUI", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map