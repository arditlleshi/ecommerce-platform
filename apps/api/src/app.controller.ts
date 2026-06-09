import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  newsletterSignupSchema,
  type NewsletterSignupInput,
  type NewsletterSignupResponse,
} from '@repo/schemas/newsletter';
import { AppService } from './app.service';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('newsletter-signups')
  async createNewsletterSignup(
    @Body(new ZodValidationPipe(newsletterSignupSchema))
    payload: NewsletterSignupInput,
  ): Promise<NewsletterSignupResponse> {
    return this.appService.createNewsletterSignup(payload);
  }
}
