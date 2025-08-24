"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: 'GET,POST,PATCH,DELETE,OPTIONS',
        credentials: false,
    });
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 KnwnCal API running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🏥 Health Dashboard: http://localhost:${port}/api/healthz/ui`);
}
bootstrap();
//# sourceMappingURL=main.js.map