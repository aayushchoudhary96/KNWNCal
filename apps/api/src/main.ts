import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // CORS configuration
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