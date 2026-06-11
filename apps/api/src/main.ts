import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  json,
  urlencoded,
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { allowedWebOrigins, env } from './config/env';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger:
      env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableShutdownHooks();
  app.enableCors({
    origin: allowedWebOrigins,
    credentials: true,
  });
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  const authService = app.get(AuthService);

  expressApp.all(
    '/api/auth/*splat',
    (request: Request, response: Response, next: NextFunction) => {
      authService.handleAuthRequest(request, response).catch(next);
    },
  );
  expressApp.use(json());
  expressApp.use(
    urlencoded({
      extended: true,
    }),
  );

  await app.listen(env.PORT);
  logger.log(`API listening on http://localhost:${env.PORT}`);
}

void bootstrap().catch((error: unknown) => {
  logger.error(
    'Failed to start the API application.',
    error instanceof Error ? error.stack : undefined,
  );
  process.exitCode = 1;
});
