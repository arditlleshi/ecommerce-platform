import { Injectable } from '@nestjs/common';
import {
  newsletterSignupResponseSchema,
  type NewsletterSignupInput,
  type NewsletterSignupResponse,
} from '@repo/schemas/newsletter';
import { NewsletterSignupsRepository } from './newsletter/newsletter-signups.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly newsletterSignupsRepository: NewsletterSignupsRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createNewsletterSignup(
    payload: NewsletterSignupInput,
  ): Promise<NewsletterSignupResponse> {
    const signup = await this.newsletterSignupsRepository.upsert(payload);
    const interestTarget =
      signup.interest === 'both' ? 'both lists' : `the ${signup.interest} list`;

    return newsletterSignupResponseSchema.parse({
      success: true,
      message: `Thanks ${signup.name}, you're on ${interestTarget}.`,
      subscriber: {
        name: signup.name,
        email: signup.email,
        interest: signup.interest,
      },
    });
  }
}
