import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  newsletterSignupListQuerySchema,
  newsletterSignupSchema,
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
  type NewsletterSignupListResponse,
  type NewsletterSignupResponse,
} from '@repo/schemas/newsletter';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { NewsletterSignupsService } from './newsletter-signups.service';

@Controller('newsletter-signups')
export class NewsletterSignupsController {
  constructor(
    private readonly newsletterSignupsService: NewsletterSignupsService,
  ) {}

  @Get()
  async findMany(
    @Query(new ZodValidationPipe(newsletterSignupListQuerySchema))
    query: NewsletterSignupListQuery,
  ): Promise<NewsletterSignupListResponse> {
    return this.newsletterSignupsService.findMany(query);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(newsletterSignupSchema))
    payload: NewsletterSignupInput,
  ): Promise<NewsletterSignupResponse> {
    return this.newsletterSignupsService.create(payload);
  }
}
