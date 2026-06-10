import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [DatabaseModule, HealthModule, NewsletterModule, AuthModule],
})
export class AppModule {}
