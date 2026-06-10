import { Inject, Injectable } from '@nestjs/common';
import { desc, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
} from '@repo/schemas/newsletter';
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

  async findMany(
    query: NewsletterSignupListQuery,
  ): Promise<{ rows: NewsletterSignupRow[]; total: number }> {
    const [rows, totalResult] = await Promise.all([
      this.db
        .select()
        .from(newsletterSignups)
        .orderBy(desc(newsletterSignups.createdAt), desc(newsletterSignups.id))
        .limit(query.limit)
        .offset(query.offset),
      this.db
        .select({
          total: sql<number>`count(*)::int`,
        })
        .from(newsletterSignups),
    ]);

    return {
      rows,
      total: totalResult[0]?.total ?? 0,
    };
  }
}
