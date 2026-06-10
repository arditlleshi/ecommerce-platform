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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
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
}
void bootstrap();
