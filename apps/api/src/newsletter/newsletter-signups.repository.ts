import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { type NewsletterSignupInput } from '@repo/schemas/newsletter';
import { DATABASE } from '../database/database.constants';
import * as schema from '../database/schema';
import {
  newsletterSignups,
  type NewsletterSignupRow,
} from '../database/schema';

@Injectable()
export class NewsletterSignupsRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async upsert(payload: NewsletterSignupInput): Promise<NewsletterSignupRow> {
    const [signup] = await this.db
      .insert(newsletterSignups)
      .values({
        name: payload.name,
        email: payload.email,
        interest: payload.interest,
      })
      .onConflictDoUpdate({
        target: newsletterSignups.email,
        set: {
          name: payload.name,
          interest: payload.interest,
          updatedAt: sql`now()`,
        },
      })
      .returning();

    return signup;
  }
}
