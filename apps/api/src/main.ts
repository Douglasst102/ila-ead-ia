import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create(AppModule, {
    logger: isProd ? ['error', 'warn', 'log'] : undefined,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const origins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
    'http://localhost:3000',
  ];
  app.enableCors({ origin: origins, credentials: true });
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'ready', method: RequestMethod.GET },
    ],
  });
  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
