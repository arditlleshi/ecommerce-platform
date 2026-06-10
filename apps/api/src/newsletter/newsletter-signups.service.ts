import { Injectable } from '@nestjs/common';
import {
  newsletterSignupListResponseSchema,
  newsletterSignupResponseSchema,
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
  type NewsletterSignupListResponse,
  type NewsletterSignupResponse,
} from '@repo/schemas/newsletter';
import { NewsletterSignupsRepository } from './newsletter-signups.repository';

@Injectable()
export class NewsletterSignupsService {
  constructor(
    private readonly newsletterSignupsRepository: NewsletterSignupsRepository,
  ) {}

  async create(
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

  async findMany(
    query: NewsletterSignupListQuery,
  ): Promise<NewsletterSignupListResponse> {
    const { rows, total } =
      await this.newsletterSignupsRepository.findMany(query);

    return newsletterSignupListResponseSchema.parse({
      success: true,
      data: rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        interest: row.interest,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      })),
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
    });
  }
}
