import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Enable CORS for both local dev server and deployed origins
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://fms-frontend-beta.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 🔹 Serve Frontend SPA if built in frontend/dist
  const frontendDist = join(process.cwd(), 'frontend', 'dist');
  if (existsSync(frontendDist)) {
    console.log(`📦 Serving integrated mobile frontend from: ${frontendDist}`);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(express.static(frontendDist));

    // Fallback to index.html for client-side routing, excluding API routes
    const apiPrefixes = [
      '/api',
      '/users',
      '/branches',
      '/vehicles',
      '/fuel-session',
      '/fuel-request',
      '/finance',
      '/reports',
    ];

    expressApp.get('*', (req: any, res: any, next: any) => {
      const isApi = apiPrefixes.some((prefix) => req.url.startsWith(prefix));
      if (isApi) {
        return next();
      }
      res.sendFile(join(frontendDist, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 RMS Full-Stack System running at http://localhost:${port}`);
}
bootstrap();
