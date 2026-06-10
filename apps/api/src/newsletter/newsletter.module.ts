import { Module } from '@nestjs/common';
import { NewsletterSignupsController } from './newsletter-signups.controller';
import { NewsletterSignupsRepository } from './newsletter-signups.repository';
import { NewsletterSignupsService } from './newsletter-signups.service';

@Module({
  controllers: [NewsletterSignupsController],
  providers: [NewsletterSignupsService, NewsletterSignupsRepository],
})
export class NewsletterModule {}
