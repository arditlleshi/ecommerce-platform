import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const newsletterInterestEnum = pgEnum('newsletter_interest', [
  'storefront',
  'admin',
  'both',
]);

export const newsletterSignups = pgTable(
  'newsletter_signups',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 120 }).notNull(),
    email: varchar({ length: 320 }).notNull(),
    interest: newsletterInterestEnum().notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex('newsletter_signups_email_idx').on(table.email)],
);

export type NewsletterSignupRow = InferSelectModel<typeof newsletterSignups>;
export type NewNewsletterSignupRow = InferInsertModel<typeof newsletterSignups>;
