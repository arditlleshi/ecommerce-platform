import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { allowedWebOrigins, env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    origin: allowedWebOrigins,
  });
  await app.listen(env.PORT);
}
void bootstrap();
