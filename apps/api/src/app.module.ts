import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { NewsletterSignupsRepository } from './newsletter/newsletter-signups.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService, NewsletterSignupsRepository],
})
export class AppModule {}
